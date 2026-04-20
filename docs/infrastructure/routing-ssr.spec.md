---
title: Routing & SSR
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related:
  - ./platform.spec.md
  - ./client-state.spec.md
  - ./server-functions.spec.md
---

## 2. Problem Statement

TanStack Start handles file-based routing, SSR, and server-function dispatch in the same Cloudflare Worker.
We need conventions for where routes live, how they fetch data, how they participate in the root context, how
they tag responses with cache headers, and how they behave across the mobile/desktop split.

- `[G-1]` File-based routing under `src/routes/` with a generated `routeTree.gen.ts`.
- `[G-2]` Root shell (`__root.tsx`) provides `authUser`, `queryClient`, `theme`, and `isAdmin` via context.
- `[G-3]` Each data-backed route uses a `loader` that pre-fetches via `context.queryClient.ensureQueryData(...)`.
- `[G-4]` Static + API routes under `src/routes/api/*` expose HTTP handlers for OAuth callback, R2 media, etc.
- `[G-5]` Recipe detail / image routes carry long-lived `Cache-Control: public, max-age=86400,
stale-while-revalidate=604800`.
- `[G-6]` Navigation is responsive: `<Navbar>` on desktop (md+), hidden on mobile; FAB on mobile for "new
  recipe"; swipe tabs on the recipe detail page.
- `[G-7]` Dev-time link preloading via `defaultPreload: 'intent'` so hovering a link pre-fetches.

## 3. Key Design Decisions

| Decision                               | Choice                                                                                                          | Rationale                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` File-based routing            | `src/routes/` + `routeTree.gen.ts`                                                                              | Convention-over-configuration; conventions co-locate code with URL.                                                  |
| `[KD-2]` Typed root context            | `createRootRouteWithContext<{authUser, queryClient, theme}>`                                                    | Every child route has typed access without prop drilling.                                                            |
| `[KD-3]` SSR + query integration       | `setupRouterSsrQueryIntegration({ queryClient, router })`                                                       | Ensures loader-fetched data hydrates the client-side QueryClient.                                                    |
| `[KD-4]` `defaultPreload: 'intent'`    | Preload on hover / focus                                                                                        | Perceived latency improves without over-fetching.                                                                    |
| `[KD-5]` gcTime 24h, staleTime 5min    | Router-wide QueryClient defaults                                                                                | Recipes rarely change; long gcTime keeps the cache warm across navigations; stale-while-revalidate covers staleness. |
| `[KD-6]` HTTP cache on detail route    | `headers: () => ({ 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' })` on `/recipe/$id` | Browser cache + CDN cache pre-empt the Worker for warm paths.                                                        |
| `[KD-7]` Zod locale for error messages | `z.config(z.locales.fr())` in `router.tsx`                                                                      | Validation errors render in French by default.                                                                       |
| `[KD-8]` `beforeLoad` for auth / theme | Root `beforeLoad` reads `authUser` + `theme`; feature routes add role checks                                    | Runs on every request; cheap calls only.                                                                             |
| `[KD-9]` Responsive navigation         | Desktop: `<Navbar>` in header; Mobile: hidden + FAB / swipe tabs                                                | Mobile feels native; desktop stays keyboard / mouse friendly.                                                        |
| `[KD-10]` Error / not-found defaults   | `DefaultErrorComponent`, `NotFound` wired at router level                                                       | Consistent fallback UIs across routes.                                                                               |

## 4. Principles & Intents

- `[PI-1]` **One loader per data-backed route** — if the route renders server data, the loader fetches it.
  Avoid client-only fetch-on-mount where the loader can do it.
- `[PI-2]` **`ensureQueryData` over `fetchQuery`** — lets the cache decide whether to re-fetch.
- `[PI-3]` **Search params are part of the route** — define them with a `validateSearch` / Zod schema; let the
  router serialize / deserialize. Don't reach into `window.location.search`.
- `[PI-4]` **API routes are thin** — they forward to helpers (R2, OAuth). Business logic stays in
  `src/features/*/api/`.
- `[PI-5]` **Regen `routeTree.gen.ts`** — running `vp dev` / `bun dev` (via pnpm scripts) regenerates. Never
  hand-edit.
- `[PI-6]` **Hide, don't conditionally render, role-gated UI** — the navbar/menu can render for everyone and
  hide items; the server still re-checks permissions.

## 5. Non-Goals

- `[NG-1]` Pure client-side routing (no SSR).
- `[NG-2]` Per-route SSR opt-out.
- `[NG-3]` Custom router other than TanStack Router.
- `[NG-4]` Nested Suspense streaming beyond what TanStack Start provides out of the box.
- `[NG-5]` Internationalization / locale routing (French-only today; Zod locale suffices).

## 6. Caveats

- `[C-1]` `routeTree.gen.ts` is regenerated by `vp dev` / dev mode. If it's out of date in CI, build fails —
  run dev once to regenerate.
- `[C-2]` `defaultPreload: 'intent'` can double-fetch if a link's loader uses network-heavy calls without a
  query cache; guard with `ensureQueryData`.
- `[C-3]` The Cache-Control header is set on `/recipe/$id` today. Other routes can be cached similarly but
  must be opted in per-route.
- `[C-4]` The service worker (see platform spec `[KD-7]`) caches GETs by default; interaction with
  `Cache-Control` headers is governed by Serwist config.
- `[C-5]` Root `beforeLoad` calls `getAuthUser()` on every request. In dev mode it short-circuits to a mocked
  admin (see auth spec `[KD-5]`), but in prod this is one DB hit per SSR request. Acceptable at current scale.

## 7. High-Level Components

| Component             | Module type     | Responsibility                                                          | Public API surface                                       |
| --------------------- | --------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- |
| Router bootstrap      | TanStack Router | `createRouter`, QueryClient, SSR/query integration, error fallbacks     | `src/router.tsx` → `getRouter`                           |
| Root route            | TanStack Route  | `<html>` shell, head tags, theme class, navbar, service worker register | `src/routes/__root.tsx`                                  |
| Generated route tree  | Build artifact  | Map of file-route paths to components                                   | `src/routeTree.gen.ts` (do not edit)                     |
| Feature routes        | Per-route files | Per-URL loaders, components, head tags, caching                         | `src/routes/**`                                          |
| API routes            | HTTP handlers   | OAuth callback, R2 image/video GET/HEAD                                 | `src/routes/api/**`                                      |
| Navigation components | React           | `<Navbar>` (desktop), `<OfflineBanner>`, `<ScreenLayout>`               | `src/components/navigation/*`, `src/components/layout/*` |
| Error + not-found     | React           | Consistent error screens                                                | `src/components/error/*`                                 |
| Swipe tabs hook       | React           | Gesture navigation on recipe detail                                     | `src/hooks/use-swipe-tabs.ts`                            |
| Service worker        | Serwist         | Offline read cache (see platform spec)                                  | `src/sw.ts`                                              |

## 8. Detailed Design

| Concern                   | Entry point                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| Router bootstrap          | `src/router.tsx`                                                                              |
| Root component + context  | `src/routes/__root.tsx`                                                                       |
| Generated route tree      | `src/routeTree.gen.ts`                                                                        |
| Feature routes            | `src/routes/index.tsx`, `search.tsx`, `shopping-list.tsx`, `recipe/*`, `settings/*`, `auth/*` |
| API routes (OAuth, media) | `src/routes/api/auth/google/*`, `src/routes/api/image/$id.ts`, `src/routes/api/video/$id.ts`  |
| Error fallback            | `src/components/error/default-error-component.tsx`                                            |
| Not-found component       | `src/components/error/not-found.tsx`                                                          |
| Offline banner            | `src/components/error/offline-banner.tsx`                                                     |
| Navbar (desktop)          | `src/components/navigation/navbar.tsx`                                                        |
| Screen layout             | `src/components/layout/screen-layout.tsx`                                                     |
| Swipe tabs                | `src/hooks/use-swipe-tabs.ts`                                                                 |

Canonical route shape (data-backed):

```typescript
export const Route = createFileRoute('/recipe/$id')({
  component: RecipePage,
  headers: () => ({
    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
  }),
  loader: async ({ context, params }) => {
    const id = Number.parseInt(params.id, 10)
    await context.queryClient.ensureQueryData(getRecipeDetailsOptions(id))
    return { id }
  },
})
```

Root context contract (see `src/routes/__root.tsx`):

```typescript
createRootRouteWithContext<{
  authUser: AuthUser
  queryClient: QueryClient
  theme: Theme
}>()
```

## 9. Verification Criteria

- `[VC-1]` Every data-backed route has a `loader` that calls `context.queryClient.ensureQueryData(...)`.
- `[VC-2]` Every route file imports route-specific server functions via their `*Options()` factory (not raw
  `createServerFn` results).
- `[VC-3]` Root `beforeLoad` populates `authUser`, `isAdmin`, `theme`.
- `[VC-4]` `/recipe/$id` response carries `Cache-Control: public, max-age=86400,
stale-while-revalidate=604800`.
- `[VC-5]` `routeTree.gen.ts` is regenerated on `vp dev` / `pnpm dev` and is not hand-edited.
- `[VC-6]` Admin-only routes (e.g., `/settings/users`) apply `authGuard('admin')` in `beforeLoad` or in their
  server-function calls.
- `[VC-7]` Service worker registration failure does not break navigation.
- `[VC-8]` `pnpm lint` + `pnpm typecheck` pass. The router's `declare module '@tanstack/react-router'` keeps
  `Router` correctly typed across feature code.

## 10. Open Questions

- `[OQ-1]` Worth extending Cache-Control to `/` (home) and `/search`? Both are public reads that change
  infrequently.
- `[OQ-2]` Is `defaultPreload: 'intent'` aggressive enough given the mobile audience? Could go `'viewport'`.
- `[OQ-3]` Should admin routes go through a shared layout route that runs `authGuard('admin')` once instead of
  per-page?
