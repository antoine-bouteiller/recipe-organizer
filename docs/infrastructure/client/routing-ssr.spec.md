---
title: Client Routing
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/client/client.spec.md
related:
  [
    docs/infrastructure/client/forms.spec.md,
    docs/infrastructure/client/client-state.spec.md,
    docs/infrastructure/server/server-functions.spec.md,
    docs/infrastructure/server/auth.spec.md,
    docs/infrastructure/server/platform.spec.md,
  ]
---

## 2. Problem Statement

Every document URL receives a static SPA shell. An in-house Navigation API router selects screens,
applies client access gates, and awaits route code and query data before committing navigation.
Feature components retain domain presentation; the Void API remains the authorization boundary.

## 3. Key Design Decisions

| Decision                     | Choice                                                                                     | Rationale                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `[KD-1]` Route declaration   | `src/pages/<route>/index.svelte`, registered in `src/lib/client/router/routes.ts`.         | One registry holds pattern, access, lazy component and preload.                          |
| `[KD-2]` Data lifecycle      | Route preload calls `queryClient.ensureQueryData`; screens observe the same queries.       | Cached data commits immediately; stale data refreshes in the background.                 |
| `[KD-3]` Render mode         | Static `index.html` mounts `src/app.svelte` through `src/main.ts`.                         | No Worker session lookup, D1 query or SSR blocks first paint.                            |
| `[KD-4]` Navigation feedback | Navigation API interception, client view transitions and history-keyed scroll restoration. | Backward traversal carries `back`; document redirects retain cross-document transitions. |

## 4. Principles & Intents

- `[PI-1]` **Compose, do not own domain logic** — screens wire feature components and query options; API handlers call server helpers.
- `[PI-2]` **Gates precede screens** — client guards choose screens; API handlers independently authorize protected reads and writes.
- `[PI-3]` **URLs are input** — routes parse params and search values; API handlers validate their own untrusted input.
- `[PI-4]` **Use actual navigation links** — Button `asLink` with `href` renders a plain anchor; navigation and preload policy stay app-owned.

## 5. Non-Goals

- `[NG-1]` Browser-only authorization; client access checks are not a security boundary.
- `[NG-2]` SSR or ISR; document responses contain no personalised server data.
- `[NG-3]` Offline navigation or a persisted query cache; the in-memory cache is owned by [client state](./client-state.spec.md).

## 6. Caveats

- `[C-1]` Run `vp exec void prepare` after API route changes to regenerate ignored route types; client screens are registered explicitly.
- `[C-2]` The Navigation API is required for client routing. Without it, links use full document navigation with no cross-document query cache or client transitions.
- `[C-3]` `index.html` progressively registers a network-only `/sw.js`; registration failure does not block rendering and no offline fallback exists.
- `[C-4]` Local development always resolves an active admin identity, so it does not prove anonymous or non-admin behavior.
- `[C-5]` A guarded hard load shows the shell until the session query resolves; redirects no longer precede document rendering.
- `[C-6]` Unknown document paths render in-app NotFound with HTTP 200 from the SPA fallback.

## 7. High-Level Components

| Component      | Module type                                   | Responsibility                                                 | Public API surface                               |
| -------------- | --------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------ |
| Static shell   | `index.html`, `src/main.ts`, `src/app.svelte` | Mount provider, header, main and pathname-keyed error boundary | Current route component                          |
| Screens        | `src/pages/**/index.svelte`                   | Compose cached query data and feature slots                    | Typed `params` props                             |
| Route registry | `src/lib/client/router/routes.ts`             | Patterns, access and code/data preload                         | `routes`                                         |
| Router         | `src/lib/client/router/router.svelte.ts`      | Matching, guards, transitions, scroll restoration              | `router.current`, `navigate`, `preload`, `start` |
| Link preload   | `src/lib/client/router/preload.ts`            | Anchor code/data preload                                       | `preloadLink` attachment                         |
| API handlers   | `routes/api/**`                               | Data, writes, session, auth, health and media                  | Named HTTP methods                               |

## 8. Detailed Design

### 8.1 Static application shell

The static `index.html` owns French language, metadata, manifest/favicon links, theme initialization,
backward document-transition and service-worker scripts, `#app`, and the module entry `/src/main.ts`.
The entry imports `global.css` and `styles.css`, sets the French Zod locale and mounts:

```text
QueryClientProvider
├── AppHeader (SearchBar, ThemeToggle)
└── AppMain
    └── AppError keyed by pathname
        └── current route component
```

Void generates only the API/middleware Worker. Its SPA fallback serves the shell for non-file,
non-`/api` paths without shadowing assets. If necessary, `middleware/03.spa-fallback.ts` supplies
that fallback. There is no root `pages/` directory or page-context middleware.

### 8.2 Screen and route contract

```ts
// src/lib/client/router/routes.ts
type Access = 'admin' | 'guest' | 'member'
export interface RouteDefinition {
  readonly pattern: `/${string}`
  readonly access?: Access
  readonly component: () => Promise<{ default: Component<{ params: Record<string, string> }> }>
  readonly preload?: (params: Record<string, string>) => Promise<unknown>
}
export const routes: readonly RouteDefinition[]
```

| Pattern                 | Access | Preloaded queries                                                  |
| ----------------------- | ------ | ------------------------------------------------------------------ |
| `/`                     |        | `recipeList`                                                       |
| `/search`               |        | `recipeList`                                                       |
| `/shopping-list`        |        | none; selection is device-local                                    |
| `/recipe/new`           | member | `ingredientList`, `recipeList`                                     |
| `/recipe/edit/:id`      | member | `recipeDetail(id)`, `ingredientList`, `recipeList`                 |
| `/recipe/:id`           |        | `recipeDetail(id)`                                                 |
| `/auth/login`           | guest  | none                                                               |
| `/settings`             | member | none                                                               |
| `/settings/account`     | member | none                                                               |
| `/settings/ingredients` | member | `ingredientList`                                                   |
| `/settings/users`       | admin  | `userList('active')`, `userList('pending')`, `userList('blocked')` |

New/edit patterns precede the detail pattern. Route preloads ensure queries and revalidate stale
cached data in the background; pages render loaded data without route skeletons.

### 8.3 Access and URL parsing

The router ensures `['session']` through `GET /api/session` before choosing a screen.
`member` requires an active session: anonymous visitors go to `/auth/login`, pending/blocked members
to `/auth/login?error=account_<status>`. `admin` sends active non-admins to `/settings`;
`guest` sends active members to `/`. Redirects replace the history entry.

Browse routes remain public. Client guards cannot authorize API requests: handlers retain membership,
role and owner-or-admin checks. The recipe detail API returns 404 for a missing recipe; the client
renders NotFound rather than treating that as successful recipe data.

### 8.4 Screen and layout boundary

`src/app.svelte` composes `AppHeader` and `AppMain`, imports search/theme controls directly and wraps children in `AppError` keyed by pathname.

Pages import feature components directly via `@/...`. Features expose slots/render props, such as
`renderCardAction`, `quantityControls`, `renderIngredientGroups`, and `backButton`, for plain
composition. The shopping-list page owns its reset button inline. Pages retain unstyled composition;
feature and app-shell owners retain CSS.

### 8.5 Errors, HTTP, and navigation

```ts
// src/lib/client/router/router.svelte.ts
export const router: {
  readonly current: {
    url: URL
    params: Record<string, string>
    component: Component | undefined
    notFound: boolean
  }
  navigate: (href: string, options?: { replace?: boolean }) => Promise<void>
  preload: (href: string) => Promise<void>
  start: () => void
}
// src/lib/client/router/preload.ts
export const preloadLink: (strategy: 'intent' | 'viewport') => Attachment<HTMLAnchorElement>
```

Navigation proceeds in order:

1. Intercept events that `canIntercept`, target a same-origin non-`/api` path without a file extension,
   and are neither hash changes nor downloads. Other navigation stays browser-owned.
2. Ensure session and apply the access gate.
3. Await `component()` and `preload(params)` together. Rejections render AppError; unmatched routes
   set `notFound` and render NotFound.
4. Commit through `document.startViewTransition` when supported; lower-index history traversal gets
   type `back`. Anchors with `data-view-transition="false"` skip it.
5. Push/replace scrolls the document and every `[data-scroll-restoration-id]` container to the top.
   Traversal restores offsets saved against the history entry's key.

A newer navigation aborts the previous one through the event's signal.
`navigate(href, { replace })` delegates to
`navigation.navigate(href, { history: replace ? 'replace' : 'auto' })`.
Shared CSS and the `index.html` script preserve backward cross-document transitions.

Button `asLink` renders a plain anchor, forwards `viewTransition` as `data-view-transition`, and
accepts an optional preload attachment supplied by the caller; UI primitives do not import the router.
Header/tab links and home recipe cards use `preloadLink('viewport')`; search cards use
`preloadLink('intent')` (pointerenter, focus, touchstart). The palette uses `router.navigate`.
`isCurrentPath` reads `router.current.url.pathname`, matching home exactly and other paths or descendants.
Tabs remain native hash anchors; their mounted handler scrolls and replaces the hash.
ScreenLayout accepts a backButton slot; GoBackButton defaults to `history.back()`.
AppError is keyed by pathname so navigation resets render failures. API middleware provides safe errors.
Storybook needs no router decorator; query-dependent hosts supply a fresh QueryClient and stubbed mutations.

### 8.6 Route contract summary

| Concern            | Shape                                                 | Consumer               |
| ------------------ | ----------------------------------------------------- | ---------------------- |
| Session            | `{ email, role, status } \| null` under `['session']` | Guards and affordances |
| URL input          | `router.current.url`, `params`                        | Screen and preload     |
| Data readiness     | `ensureQueryData` before commit                       | Query-backed screen    |
| Local-only loading | Selected-ID query after browser selection             | Shopping list          |
| Access             | Client screen redirects; independent API guards       | Router and Worker      |
| Mutation           | Feature `mutationOptions`, key invalidation           | `createMutation`       |
| HTTP endpoint      | `readResponse(fetch(...))` from `void/client`         | Feature API options    |

### 8.7 Render-boundary rules

Server records live only in the in-memory query cache, not persisted entity stores. Feature API
options own requests and mutation invalidation; callers await writes and choose closing/navigation.
Recipe create/delete replaces navigation to `/`; update replaces it to `/recipe/<id>`, so Back
cannot reopen a deleted recipe. Forms use app-owned `createForm`; see the forms and client-state leaves.

Persisted IDs/quantities remain browser-local. The existing `useIsHydrated` and persisted-store
snapshot compatibility paths are always-client in this SPA; simplifying them is out of scope.
Shopping-list queries still wait for device-local selection and may show a pending state.

### 8.8 Outcome and acceptance

- `[SO-1]` Every document URL mounts the static shell; loaded code/data commit through client navigation — demonstrated by `[VC-1]`.
- `[SO-2]` Client gates preserve screen access while guarded API writes refresh cached data — demonstrated by `[VC-2]`.
- `[VC-1]` Hard-load the registered URLs: they receive the same shell; card/palette visits do not
  reload the document. Unknown paths render NotFound with HTTP 200; `/manifest.json` remains an asset.
  Visible home cards preload detail data; revisiting stale cached data commits immediately and
  refetches in the background. Back restores document and ScreenLayout offsets with a `back`
  transition; pushes start at the top — demonstrates `[SO-1]`.
- `[VC-2]` With production-like identities, client gates redirect anonymous/inactive/non-admin
  visitors appropriately while direct unauthorized APIs fail. Successful writes invalidate affected
  queries; recipe deletion replaces navigation home so Back cannot reopen it; missing recipes show
  in-page recovery — demonstrates `[SO-2]`.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                                                      | Sections affected | Reason                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------- |
| 2026-09-13 | Route the API catch-all through Hono RPC while retaining media route handlers.                                 | 7, 8.5, 8.7       | Reflect the migrated API adapter boundary.                                 |
| 2026-09-13 | Dispatch media through the API catch-all.                                                                      | 7, 8.5            | Give all API endpoints the same Hono boundary.                             |
| 2026-09-13 | Replace SSR and file-route API adapters with the browser SPA and Worker entry.                                 | 2–3, 7–8          | Make browser routing and direct Hono dispatch explicit.                    |
| 2026-09-16 | Document Base UI render composition with the actual router Link.                                               | 4, 8.5            | Preserve routing behavior without bespoke native-anchor adapters.          |
| 2026-09-18 | Move reusable router-only presentation into the design system.                                                 | 4, 8.4–8.5        | Keep typed links and router behavior in DS while app routes retain policy. |
| 2026-09-18 | Keep routes as unstyled composition of feature sections and the app shell.                                     | 8.4–8.5           | Colocate presentation and styles without moving routing contracts.         |
| 2026-09-18 | Document optional query prefetch and inline isLoading skeletons.                                               | 8.2–8.4, 8.6–8.7  | Match current query APIs and page-owned loading feedback.                  |
| 2026-09-19 | Inline single-use desktop navigation and error rendering in their app owners.                                  | 8.4–8.5           | Remove unused DS abstractions while retaining typed links and safe errors. |
| 2026-09-28 | Replace Base UI render composition with Button `asLink`.                                                       | 4, 8.5            | Base UI is no longer a dependency.                                         |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries.                         | Updated contracts | Reflect the completed page migration.                                      |
| 2026-10-03 | Document hydrated layouts, client navigation, prefetch, and delete redirects.                                  | 2–3, 6–8          | Keep recipe visits responsive and deletion history safe.                   |
| 2026-10-04 | Migrate pages, layout, and boundary conventions to Svelte (`voidSvelte`, `index.svelte`, `<svelte:boundary>`). | 3, 7–8            | Match the shipped Svelte file/API conventions.                             |
