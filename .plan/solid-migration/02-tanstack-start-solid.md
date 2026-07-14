# §02 — TanStack Start (React → Solid)

The TanStack Solid adapters mirror the React API almost exactly. This step is mostly import
renames plus a handful of Solid-idiom adjustments in the entry files. After it, the app routes and
SSRs an empty shell.

## Files touched

- `src/router.tsx`
- `src/routes/__root.tsx`
- `src/routes/**` (all route files — import renames + component body per §03)
- `src/routeTree.gen.ts` (regenerated — never hand-edit)
- `src/start.ts` (if present — `defaultSsr` config per architecture REQ-002)
- `src/router.tsx` `declare module` block

## router.tsx

Pure import swap; the body is unchanged:

```ts
import { QueryClient } from '@tanstack/solid-query'
import { createRouter } from '@tanstack/solid-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/solid-router-ssr-query'
```

```ts
declare module '@tanstack/solid-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

`defaultViewTransition`, `scrollRestoration`, `notFoundMode`, context shape — all identical.
`v.setGlobalConfig({ lang: 'fr' })` and the `@valibot/i18n/fr` side-effect import are unchanged.

## Server functions

`createServerFn` from `@tanstack/solid-start` has the **same** builder API
(`.middleware().validator().handler()`). The `src/features/*/api/*.ts` files are framework-agnostic
on the server side — only the import path changes:

```ts
import { createServerFn } from '@tanstack/solid-start' // was @tanstack/react-start
```

`authGuard`, `withServerError`, Drizzle calls, R2 — untouched. The `*Options()` query-factory half
of each api file changes only via §07 (solid-query's `queryOptions`/`mutationOptions`).

`getRequest`/`getRequestHeaders` (used by `getAuthUser`, see memory S1706) live in
`@tanstack/start-server-core` and are framework-neutral — no change.

## \_\_root.tsx

`createRootRouteWithContext<...>()({ ... })` API is identical. Body changes are §03 idioms:

- `useEffect(() => {...}, [])` (SW registration) → `onMount(() => {...})` from `solid-js`.
- `lazy(() => import(...))` → `lazy` from `solid-js` (same call shape, different import).
- `<Suspense fallback={...}>` → `Suspense` from `solid-js`.
- `Route.useRouteContext()` returns an **accessor** in Solid — `const ctx = Route.useRouteContext();`
  then read `ctx().theme`. Update the `<html class={ctx().theme}>` binding accordingly.
- `className` → `class` throughout (Solid uses DOM attribute names).
- `HeadContent`, `Outlet`, `Scripts` import from `@tanstack/solid-router`.
- Devtools: `@tanstack/solid-devtools` + `@tanstack/solid-query-devtools`; the plugin array shape
  may differ — check the installed devtools README, or drop devtools for the first cutover
  (ponytail: add back once the app runs).

`shellComponent`, `head()`, `beforeLoad` are unchanged in shape. `beforeLoad` returning
`{ authUser, isAdmin, theme }` stays.

## Client-only render mode

Architecture REQ-002/CON-004: `defaultSsr: false`, root `ssr: true`. The Solid Start config uses
the same knobs (`start.ts` / router options). Preserve them — Solid handles client-only routes with
no `<ClientOnly>` boundary the same way, because store-backed components (§07) never render on the
server. Keep this invariant; it's why there are no hydration guards in the codebase.

## Route regeneration

Per project CLAUDE.md: **route changes require regenerating the tree and restarting `pnpm dev`**.
Delete `routeTree.gen.ts` and let the Solid router plugin regenerate on dev boot. Do not port it by
hand.

## Validation

- `pnpm dev` serves `/` with the real root shell (nav can be a placeholder until §04).
- SSR HTML contains the shell + hydration scripts (mirror the check from memory 7674).
- Fresh no-cache load returns 200 (guard against the SSR-deadlock class of bug from memory
  S1705/7643 — the isomorphic `getAuthUser` fix must be preserved through the port).

## ponytail notes

- Server-side api files are the cheapest part of the migration — batch all the import renames in
  one pass, don't migrate them one feature at a time.
- Skip devtools on first boot; they're the flakiest cross-framework piece and add nothing to
  correctness.
