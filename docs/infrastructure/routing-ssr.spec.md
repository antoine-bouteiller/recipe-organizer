---
title: Routing & SSR Specification
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [infrastructure, routing, ssr, tanstack-router, file-routes, view-transitions]
---

# Introduction

This specification describes the routing surface and server-side rendering (SSR) pipeline of the
`recipe-organizer` application. It captures the file-based route convention, the typed router
context, authentication/admin gating, loader-driven prefetching, search/param validation, HTTP cache
headers on rendered routes, view-transition usage, layout strategy, error boundaries, and the
service worker registration that integrates with offline support. Its scope covers the **routing
contract and SSR shell** only; data fetching contracts, server functions, and platform bindings are
deferred to their own specs (see section 11).

## 1. Purpose & Scope

**Purpose** — Provide a single, authoritative description of how URLs map to components, what data
each route prefetches, which routes require authentication or admin role, and how SSR is wired
through TanStack Start on Cloudflare Workers. Any change to the route tree, root context, error
boundaries, or SSR/Query integration must be reflected in this document.

**Scope (in)**

- File-based routing under `src/routes/` and the generated route tree.
- The `getRouter()` factory in `src/router.tsx` (router options, defaults, SSR-Query integration).
- The root route (`__root.tsx`): typed context, `beforeLoad` (auth + theme), HTML shell, providers,
  service worker registration.
- Per-route conventions: page routes, API routes, search/params validation, loaders, redirects,
  cache headers, headers metadata, error/not-found components.
- View transitions on `<Link>` and the `useBackViewTransition` hook for browser-back navigation.
- `ScreenLayout` integration (mobile gradient header + sticky title + optional `TabBar`) and the
  desktop `Navbar` strategy.
- Service worker registration and the `OfflineBanner`.

**Scope (out)**

- Cloudflare bindings, build pipeline, and SW emission — see [`./platform.spec.md`](./platform.spec.md).
- Server function/RPC contract — see [`./server-functions.spec.md`](./server-functions.spec.md).
- Drizzle schema, query options, and mutation hooks — see [`./data-layer.spec.md`](./data-layer.spec.md)
  and [`./client-state.spec.md`](./client-state.spec.md).
- Form patterns inside route components — see [`./forms.spec.md`](./forms.spec.md).

**Intended audience** — Frontend engineers and AI agents adding/moving routes, changing auth gates,
modifying the SSR shell, or wiring view transitions and layout chrome.

**Assumptions**

- TanStack Router file-based routing is enabled via `@tanstack/router-plugin/vite` with the route
  tree generated at `src/routeTree.gen.ts`.
- TanStack Start owns the SSR runtime; the Cloudflare Worker entrypoint is
  `@tanstack/react-start/server-entry` (see `wrangler.jsonc`).
- The QueryClient/Router SSR hydration is performed by `setupRouterSsrQueryIntegration`.

## 2. Definitions

- **Route tree** — The auto-generated file `src/routeTree.gen.ts`. Source of truth for path → file
  mapping. Never edited by hand.
- **File route** — A route declared via `createFileRoute('/path')({ ... })` whose path argument MUST
  match the file's location under `src/routes/`.
- **Root route** — The shell route declared via `createRootRouteWithContext<TContext>()` in
  `src/routes/__root.tsx`. Renders `<html>`, providers, devtools, and `<Outlet />`.
- **Route context** — A typed object propagated from the root through `beforeLoad` returns.
  Available to all child routes via `Route.useRouteContext()`.
- **Loader** — A route hook that runs before render (server + client). Used here exclusively to
  prefetch queries via `context.queryClient.ensureQueryData(...)` and to surface validated params.
- **`beforeLoad`** — Route hook running before the loader. Used here for auth/admin redirects and
  for loading the auth user / theme on the root.
- **`validateSearch`** — Zod-based parser for `?query=` parameters declared on a route. Returns the
  typed search bag exposed via `Route.useSearch()`.
- **`paramsSchema`** — Zod schema applied to dynamic segment values (e.g. `$id`) inside the loader.
- **Server handler route** — A route declared with `server: { handlers: { GET, HEAD, ... } }` (no
  `component`). Used for non-RPC HTTP endpoints under `/api/*`.
- **`defaultPreload: 'intent'`** — Hover/focus on a `<Link>` triggers prefetching of its loader and
  matched query options.
- **`notFoundMode: 'root'`** — A child `notFound()` bubbles up and is rendered by the root's
  `defaultNotFoundComponent`.
- **View transition** — Browser-native `document.startViewTransition` integration. Triggered by
  `<Link viewTransition />` (forward) and by the `useBackViewTransition` popstate interceptor (back).

## 3. Requirements, Constraints & Guidelines

### Functional requirements

- **REQ-001** — The router MUST be created by `getRouter()` (`src/router.tsx`) using
  `createRouter` from `@tanstack/react-router` with the generated `routeTree`, `defaultPreload:
'intent'`, `notFoundMode: 'root'`, `defaultErrorComponent: DefaultErrorComponent`, and
  `defaultNotFoundComponent: NotFound`.
- **REQ-002** — The router context MUST be initialized to
  `{ authUser: undefined, queryClient, theme: 'light' }` and the `Register` interface MUST be
  augmented so route helpers are typed against `getRouter`'s return type.
- **REQ-003** — A `QueryClient` MUST be instantiated per `getRouter()` call with
  `defaultOptions.queries.staleTime = 5 minutes` and `gcTime = 24 hours`, then passed to
  `setupRouterSsrQueryIntegration({ queryClient, router })` so SSR-fetched query state is
  serialized and rehydrated on the client.
- **REQ-004** — The root route MUST be declared via
  `createRootRouteWithContext<{ authUser: AuthUser; queryClient: QueryClient; theme: Theme }>()`
  and MUST set `shellComponent` (not `component`) so it owns the `<html>` element.
- **REQ-005** — The root `beforeLoad` MUST resolve `getAuthUser()` and `getTheme()` and return
  `{ authUser, isAdmin: authUser?.role === 'admin', theme }` so child routes can gate on
  `context.authUser` and `context.isAdmin`.
- **REQ-006** — The root MUST render `<html lang="fr" className={theme}>`, mount `<HeadContent />`
  in `<head>`, mount `<Scripts />` in `<body>`, wrap children with `<ToastProvider>`, render
  `<OfflineBanner />` and a sticky desktop-only `<Navbar />` (`md:block`), and place the routed
  content inside `<main><Outlet /></main>`.
- **REQ-007** — The root `head()` MUST declare the stylesheet (`appCss`), `manifest.json`,
  `favicon.ico`, `apple-touch-icon.png`, and the Cal Sans + Roboto Google Fonts stylesheet plus
  preconnects to `fonts.googleapis.com` and `fonts.gstatic.com`. Meta MUST include
  `charSet: 'utf8'`, the mobile `viewport` directive
  (`width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content`),
  the `title` `Recipe Organizer`, and `theme-color: #2f0d68`.
- **REQ-008** — On client mount, the root MUST register the service worker via
  `new Serwist('/sw.js', { scope: '/', type: 'module' })` inside a `try/catch` whose `catch` is
  intentionally empty. The app MUST keep working when registration fails.
- **REQ-009** — Page routes MUST be declared as `createFileRoute('/<path>')({ component, ... })`
  where `<path>` exactly matches the file location under `src/routes/`. After adding or moving a
  route file, `pnpm dev` MUST be restarted so the route tree regenerates (see CLAUDE.md).
- **REQ-010** — Authenticated-only routes (`/recipe/new`, `/recipe/edit/$id`, `/settings`,
  `/settings/account`, `/settings/users`) MUST guard with `beforeLoad: ({ context }) => { if
(!context.authUser) throw redirect({ to: '/auth/login' }) }`.
- **REQ-011** — `/auth/login` MUST guard against re-entry: `beforeLoad: ({ context }) => { if
(context.authUser) throw redirect({ to: '/' }) }`.
- **REQ-012** — `/settings/index` MUST hide admin-only sections by filtering `settingsSections` on
  `context.isAdmin`. `/settings/users` MUST additionally guard with its own `beforeLoad` that
  redirects to `/settings` when `context.authUser?.role !== 'admin'` — defense-in-depth so that
  a direct URL navigation by a non-admin still bounces (the parent `/settings` only enforces
  authentication).
- **REQ-013** — `/settings/ingredients` MUST allow read access to any authenticated user but MUST
  gate write affordances (`EditIngredient`, `DeleteIngredient` in `ItemActions`) on
  `context.isAdmin`.
- **REQ-014** — Anonymous-readable routes (`/`, `/recipe/$id`, `/search`, `/auth/login`) MUST NOT
  have an auth `beforeLoad` redirect. They render whether or not `authUser` is set; the recipe
  list and detail conditionally render author affordances based on `authUser`.
- **REQ-015** — Route loaders MUST prefetch the queries the component will read via
  `context.queryClient.ensureQueryData(<queryOptions>)`. The component then calls `useQuery` or
  `useSuspenseQuery` against the same options to consume the hydrated cache.
- **REQ-016** — Dynamic numeric segments MUST be parsed in the loader using a Zod
  `paramsSchema = z.object({ id: z.string().transform((s) => Number.parseInt(s, 10)) })` and the
  parsed `id` MUST be returned from the loader so the component reads it via
  `Route.useLoaderData()`. Applies to `/recipe/$id` and `/recipe/edit/$id`.
- **REQ-017** — `validateSearch` MUST be a Zod parser. Routes that declare it:
  - `/`: `z.object({ search: z.boolean().optional() })`
  - `/auth/login`: `z.object({ error: z.string().optional() })` (rendered as a toast on mount).
- **REQ-018** — Pages whose payload is publicly cacheable MUST set
  `headers: () => ({ 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' })`.
  Currently applied to `/` and `/recipe/$id`.
- **REQ-019** — API routes MUST be declared as `createFileRoute('/api/<path>')({ server: {
handlers: { GET, HEAD, ... } } })` with no `component`. They are HTTP-method-keyed
  `Request -> Response` handlers. Existing API routes:
  - `/api/auth/google/callback` — `GET` exchanges the OAuth code/state then `throw redirect({ to:
'/' })`.
  - `/api/image/$id` — `GET` proxies an R2 object via `createR2GetHandler('image/webp')`.
  - `/api/video/$id` — `GET` and `HEAD` proxy an R2 object via
    `createR2GetHandler('video/mp4')` / `createR2HeadHandler('video/mp4')`.
- **REQ-020** — `<Link>` elements that navigate forward to a content page (recipe card, search
  result, settings card, edit-recipe action, FAB to `/recipe/new`) MUST set the `viewTransition`
  prop so the browser performs a `document.startViewTransition` on click.
- **REQ-021** — Screens that render a back-button (mobile `ScreenLayout` with `withGoBack`) MUST
  call `useBackViewTransition(true)`. The hook intercepts the `popstate` event with
  `capture: true`, stops further propagation, toggles the `back-transition` class on
  `<html>`, redispatches the popstate inside `document.startViewTransition`, and waits for the
  router's `onResolved` event before completing the transition. The class is removed in
  `transition.finished.then(...)`.
- **REQ-022** — `ScreenLayout` MUST render the violet gradient header on mobile only
  (`md:hidden`), expose `withGoBack` (calls `router.history.back()`), `headerEndItem` (action
  slot), `backgroundImage` (overlayed image with vertical gradient mask), and an optional
  `pageKey` that mounts the bottom `<TabBar activePage={pageKey} />`. Desktop relies on the root's
  sticky `<Navbar>` plus content panels rendered inside `<Outlet />`.
- **REQ-023** — The default error component (`DefaultErrorComponent`) MUST display
  `Whoops! / Une erreur est survenue` plus a "Retour à la page d'accueil" `<Link to="/" />`. In
  `import.meta.env.DEV`, it MUST also render the `error.message` inside a `<code>` block.
- **REQ-024** — `notFoundMode: 'root'` is mandatory: any nested `notFound()` MUST bubble up to the
  root and be rendered by `NotFound` (`components/error/not-found.tsx`).
- **REQ-025** — `OfflineBanner` MUST render only after client mount and only when
  `navigator.onLine === false`. It listens to `online`/`offline` events and removes itself when
  connectivity returns.

### Constraints

- **CON-001** — `src/routeTree.gen.ts` is generated by the TanStack Router Vite plugin and MUST
  NOT be edited by hand. The dev server regenerates it on file add/move/rename — restart
  `pnpm dev` after such changes (CLAUDE.md mandate).
- **CON-002** — File path and `createFileRoute('<path>')` argument MUST match exactly. Mismatches
  fail type-checking against the generated tree.
- **CON-003** — The root route MUST use `shellComponent` (not `component`) because it owns
  `<html>` / `<head>` / `<body>`. Switching to `component` breaks SSR document emission.
- **CON-004** — `setupRouterSsrQueryIntegration` MUST be called before `getRouter()` returns;
  reordering breaks Query hydration on the client and produces a flash of pending state.
- **CON-005** — `defaultPreload: 'intent'` couples hover-prefetch to loader execution. Loaders
  MUST therefore be cheap and idempotent — they only call `ensureQueryData`, never mutate.
- **CON-006** — `useBackViewTransition` only activates when `document.startViewTransition` exists
  (Chromium-based browsers as of 2026-05). On unsupported browsers the hook is a no-op; back
  navigation still works without the slide animation.
- **CON-007** — `useBackViewTransition` listens with `{ capture: true }` and calls
  `event.stopImmediatePropagation()`. Adding another capture-phase popstate listener that runs
  before this hook will swallow the back animation; downstream popstate listeners in non-capture
  phase are unaffected because the hook itself redispatches the event.
- **CON-008** — Server handler routes (`/api/*`) MUST NOT export a `component`. Mixing the two on
  the same file route is unsupported.
- **CON-009** — The OAuth callback (`/api/auth/google/callback`) finishes by `throw redirect({ to:
'/' })`. The `throw` form is required so TanStack Router serializes the redirect; returning a
  redirect object would render the route component instead.
- **CON-010** — Cache headers from `headers()` are emitted on the SSR HTML response only. They do
  NOT flow through to subsequent client-side navigations (which are JSON loader fetches managed by
  the router/Query cache).
- **CON-011** — `validateSearch` runs on every navigation, including programmatic ones. It must be
  total — `safeParse` is required when malformed input is plausible (e.g. `/`'s `search`
  param), `parse` is acceptable when the value is always controlled (e.g. `/auth/login`'s
  `error`).
- **CON-012** — The QueryClient instance is per-request on the server (because `getRouter()` is
  called per-request) and per-document on the client. Long-lived caching across navigations relies
  on the client QueryClient kept alive by the router shell.
- **CON-013** — `Route.useRouteContext()` reads the context computed by `beforeLoad`. Calling it
  in a component before `beforeLoad` finishes is impossible by construction (route render is
  blocked until `beforeLoad` resolves), but a redirect thrown from `beforeLoad` aborts loader and
  component rendering.

### Guidelines

- **GUD-001** — Prefer colocating Zod schemas (`searchSchema`, `paramsSchema`) at the top of the
  route file with module scope so they can be reused inside both `validateSearch`/`loader` and
  any nested helpers.
- **GUD-002** — When a route depends on multiple datasets, prefetch them all in the loader so the
  initial render is hydrated. Example: `/recipe/edit/$id` prefetches `getRecipeDetailsOptions`,
  `getIngredientListOptions`, and `getRecipeListOptions`.
- **GUD-003** — Keep route components small: delegate UI primitives to `components/ui/*`,
  feature-specific UI to `features/<name>/components/*`, and keep the route file focused on
  context wiring, loader/search/params declaration, and layout composition.
- **GUD-004** — Use `useSuspenseQuery` when the loader has guaranteed prefetch and the consuming
  component is happy to suspend (most pages). Use `useQuery` when nullable rendering is desired
  (e.g. recipe detail's `if (!recipe) return null`).
- **GUD-005** — Use `<ClientOnly>` for components that depend on client-only state
  (`localStorage`, `navigator.onLine`, motion, swipe gestures) to avoid SSR hydration mismatches.
- **GUD-006** — When forwarding a `<Button>` to a `<Link>`, use the `render` prop pattern:
  `render={<Link to=... viewTransition />}`. This preserves Button styling while delegating
  navigation.
- **GUD-007** — Loaders that need to redirect MUST do so via `throw redirect(...)` (never return
  a Response). Same for `beforeLoad`.

### Patterns

- **PAT-001** — _Authenticated page guard._

  ```tsx
  export const Route = createFileRoute('/recipe/new')({
    beforeLoad: ({ context }) => {
      if (!context.authUser) throw redirect({ from: '/recipe/new', to: '/auth/login' })
    },
    component: NewRecipePage,
    loader: async ({ context }) => {
      await context.queryClient.ensureQueryData(getIngredientListOptions())
      await context.queryClient.ensureQueryData(getRecipeListOptions())
    },
  })
  ```

- **PAT-002** — _Public, cache-headed listing page with search params._

  ```tsx
  const searchSchema = z.object({ search: z.boolean().optional() })

  export const Route = createFileRoute('/')({
    component: RecipeList,
    headers: () => ({ 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' }),
    loader: async ({ context }) => {
      await context.queryClient.ensureQueryData(getRecipeListOptions())
    },
    validateSearch: (search) => {
      const result = searchSchema.safeParse(search)
      if (!result.success) throw new Error(result.error?.issues[0]?.message ?? 'Invalid search params')
      return result.data
    },
  })
  ```

- **PAT-003** — _Detail page with parsed numeric param + cache headers._

  ```tsx
  const paramsSchema = z.object({ id: z.string().transform((s) => Number.parseInt(s, 10)) })

  export const Route = createFileRoute('/recipe/$id')({
    component: RecipePage,
    headers: () => ({ 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' }),
    loader: async ({ context, params }) => {
      const result = paramsSchema.safeParse(params)
      if (!result.success) throw new Error(result.error?.issues[0]?.message ?? 'Invalid id')
      const { id } = result.data
      await context.queryClient.ensureQueryData(getRecipeDetailsOptions(id))
      return { id }
    },
  })
  ```

- **PAT-004** — _API route handler._

  ```ts
  export const Route = createFileRoute('/api/image/$id')({
    server: { handlers: { GET: createR2GetHandler('image/webp') } },
  })
  ```

- **PAT-005** — _OAuth callback: handler that finishes with `throw redirect`._

  ```ts
  export const Route = createFileRoute('/api/auth/google/callback')({
    server: {
      handlers: {
        GET: async ({ request }) => {
          const url = new URL(request.url)
          const code = url.searchParams.get('code')
          const state = url.searchParams.get('state')
          if (!code || !state) throw new Error('Missing code or state')
          await handleGoogleCallback(code, state)
          throw redirect({ to: '/' })
        },
      },
    },
  })
  ```

- **PAT-006** — _Mobile screen with back button + view transition + tab bar._

  ```tsx
  <ScreenLayout title="Recettes" pageKey="/" />            // bottom TabBar
  <ScreenLayout title="Modifier la recette" withGoBack />  // mobile back button + back transition
  <ScreenLayout title={recipe.name} withGoBack backgroundImage={recipe.image} headerEndItem={...} />
  ```

  `useBackViewTransition(withGoBack)` is invoked inside `ScreenLayout` automatically.

- **PAT-007** — _Forward navigation with view transition._

  ```tsx
  <Link to="/recipe/$id" params={{ id: recipe.id.toString() }} viewTransition />
  ```

- **PAT-008** — _Login page with toast-driven error param._

  ```tsx
  const searchSchema = z.object({ error: z.string().optional() })

  export const Route = createFileRoute('/auth/login')({
    beforeLoad: ({ context }) => {
      if (context.authUser) throw redirect({ to: '/' })
    },
    component: LoginPage,
    validateSearch: (search) => searchSchema.parse(search),
  })
  ```

  The component reads `Route.useSearch()` and surfaces `error` via `toastManager.add(...)` in a
  `useEffect`.

## 4. Route Inventory

The following table is exhaustive for routes currently defined under `src/routes/`. "Auth" =
`beforeLoad` redirects unauthenticated users. "Admin (UI)" = component branches on
`context.isAdmin` for write actions but does not redirect.

| Path                        | File                                 | Auth                                          | Loader prefetch                                                                       | Search / Params                                       | Cache-Control                                          |
| --------------------------- | ------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| `/` (index)                 | `routes/index.tsx`                   | Public                                        | `getRecipeListOptions()`                                                              | `searchSchema = { search?: boolean }` (safeParse)     | `public, max-age=86400, stale-while-revalidate=604800` |
| `/search`                   | `routes/search.tsx`                  | Public                                        | `getRecipeListOptions()`                                                              | —                                                     | —                                                      |
| `/shopping-list`            | `routes/shopping-list.tsx`           | Public                                        | — (client-only data via `<ClientOnly>` + Suspense)                                    | —                                                     | —                                                      |
| `/auth/login`               | `routes/auth/login.tsx`              | Anti-auth (redirects to `/` if signed in)     | —                                                                                     | `searchSchema = { error?: string }` (parse)           | —                                                      |
| `/recipe/$id`               | `routes/recipe/$id.tsx`              | Public                                        | `getRecipeDetailsOptions(id)`                                                         | `paramsSchema = { id: string -> number }` (in loader) | `public, max-age=86400, stale-while-revalidate=604800` |
| `/recipe/new`               | `routes/recipe/new.tsx`              | Required                                      | `getIngredientListOptions()`, `getRecipeListOptions()`                                | —                                                     | —                                                      |
| `/recipe/edit/$id`          | `routes/recipe/edit.$id.tsx`         | Required                                      | `getRecipeDetailsOptions(id)`, `getIngredientListOptions()`, `getRecipeListOptions()` | `paramsSchema = { id: string -> number }` (in loader) | —                                                      |
| `/settings` (layout)        | `routes/settings.tsx`                | Required                                      | —                                                                                     | —                                                     | —                                                      |
| `/settings/` (index)        | `routes/settings/index.tsx`          | Inherits                                      | —                                                                                     | —                                                     | —                                                      |
| `/settings/account`         | `routes/settings/account.tsx`        | Inherits                                      | —                                                                                     | —                                                     | —                                                      |
| `/settings/ingredients`     | `routes/settings/ingredients.tsx`    | Inherits                                      | `getIngredientListOptions()`                                                          | —                                                     | —                                                      |
| `/settings/users`           | `routes/settings/users.tsx`          | Admin (own `beforeLoad` redirects non-admins) | `getUserListOptions('active')`, `('blocked')`, `('pending')`                          | —                                                     | —                                                      |
| `/api/auth/google/callback` | `routes/api/auth/google/callback.ts` | n/a (server)                                  | `GET` — exchanges OAuth code/state then `throw redirect({ to: '/' })`                 | URL search params: `code`, `state` (raw)              | n/a                                                    |
| `/api/image/$id`            | `routes/api/image/$id.ts`            | n/a (server)                                  | `GET = createR2GetHandler('image/webp')`                                              | Path: `$id`                                           | Set by R2 helper                                       |
| `/api/video/$id`            | `routes/api/video/$id.ts`            | n/a (server)                                  | `GET = createR2GetHandler('video/mp4')`, `HEAD = createR2HeadHandler('video/mp4')`    | Path: `$id`                                           | Set by R2 helper                                       |

Notes:

- `/settings` is a pathless layout route that only declares `beforeLoad` for the auth gate; it has
  no `component` and inherits its outlet from the root.
- `/settings/users` has its own `beforeLoad` that redirects non-admins to `/settings`. The
  presentation-level filter on `/settings/index`'s card list hides the entry from the menu;
  the route-level guard makes direct URL navigation also bounce.
- `/settings/ingredients` exposes read-only listing to all authenticated users; mutation buttons
  (`EditIngredient`, `DeleteIngredient`) render only when `isAdmin === true`.
- `/recipe/edit/$id`'s file uses the dot-segment convention (`edit.$id.tsx`) which TanStack
  Router's file plugin maps to the path `/recipe/edit/$id`.

## 5. Root Context & SSR Pipeline

### 5.1 Context shape

```ts
type RootContext = {
  authUser: Awaited<ReturnType<typeof getAuthUser>> // user record or undefined
  queryClient: QueryClient
  theme: ReturnType<typeof getTheme> // 'light' | 'dark' | system
}

// Augmented inside __root.tsx#beforeLoad:
type ResolvedRootContext = RootContext & { isAdmin: boolean }
```

- Initial values are passed to `createRouter({ context: { authUser: undefined, queryClient, theme:
'light' } })`.
- The actual values are computed in the root `beforeLoad` and merged into the context for all
  descendants.

### 5.2 SSR pipeline

1. **Cloudflare Worker** invokes `@tanstack/react-start/server-entry` (the package main, see
   `wrangler.jsonc`).
2. **TanStack Start** calls `getRouter()` per request → fresh `QueryClient` + `Router` with the
   generated tree.
3. **Router resolution** runs `__root#beforeLoad` (auth + theme), then matched-route `beforeLoad`s
   (auth gates), then matched-route loaders (query prefetch via `ensureQueryData`).
4. **`setupRouterSsrQueryIntegration`** wires the QueryClient cache into the SSR stream so
   prefetched queries are dehydrated alongside the router state.
5. **Render** emits the document HTML. The root sets `Cache-Control` (when defined per route via
   `headers()`).
6. **Client hydration** rehydrates router state and Query cache from `<Scripts />`. The root's
   `useEffect` registers the service worker.

### 5.3 Service worker

- Source: `src/sw.ts`. Built into `/sw.js` by `tanstackSerwistPlugin` (see
  `scripts/generate-sw.ts`). Powered by Serwist defaults — runtime caching for static assets and
  navigation preload. Build-time precache via `injectManifest` (production only).
- Registration: `useEffect` in `__root.tsx` calls `new Serwist('/sw.js', { scope: '/', type:
'module' }).register()` inside a try/catch that silently ignores failures (offline support is
  not critical to functional behavior).
- Offline UX: `<OfflineBanner />` shows the yellow disconnected banner when
  `navigator.onLine === false`, listening to `online`/`offline` events.

## 6. Layout Strategy

- **Root layout** — `__root.tsx` provides the `<html>`/`<body>`, providers, devtools, and the
  desktop-only sticky `<Navbar>`. Mobile keeps the navbar hidden (`md:block`).
- **Mobile screen layout** — `ScreenLayout` (`src/components/layout/screen-layout.tsx`) renders a
  violet gradient header with optional `backgroundImage`, a left back button (when `withGoBack`),
  the `title`, an optional right `headerEndItem`, and (when `pageKey` is set) the bottom
  `<TabBar activePage={pageKey} />`. The body is scrollable on mobile and gains rounded top
  corners due to a `-mt-10 rounded-t-3xl` overlap with the header.
- **Desktop layout** — `ScreenLayout` hides the gradient header (`md:hidden`) and lets the
  desktop `<Navbar>` from the root provide chrome. The content area is constrained to
  `md:max-w-5xl` and uses normal scrolling.
- **Back navigation** — `ScreenLayout` calls `useBackViewTransition(withGoBack)` so the Android
  back button / browser back gesture triggers the `back-transition` slide animation in supported
  browsers.

## 7. Error Handling

- `defaultErrorComponent: DefaultErrorComponent` — displayed on caught render errors. Includes a
  return-home `<Link to="/" />` and surfaces `error.message` only in `import.meta.env.DEV`.
- `defaultNotFoundComponent: NotFound` — shown for unmatched URLs. Combined with
  `notFoundMode: 'root'`, any nested `notFound()` thrown by a loader/component bubbles up.
- `/recipe/edit/$id` additionally renders `<NotFound />` inline when the recipe data is missing
  after a successful load (defensive; the loader prefetches but the response could be empty).

## 8. Acceptance criteria

- **AC-001** — Adding a file `src/routes/foo/bar.tsx` with `createFileRoute('/foo/bar')({ ... })`
  and restarting `pnpm dev` makes `/foo/bar` reachable; the generated `routeTree.gen.ts` includes
  it; navigation from a `<Link to="/foo/bar" />` triggers prefetching on hover.
- **AC-002** — Visiting `/recipe/new` while signed-out produces a redirect to `/auth/login` with
  no flicker; visiting `/auth/login` while signed-in produces a redirect to `/`.
- **AC-003** — A signed-out visit to `/` SSR-renders the recipe list (queries are dehydrated) and
  the response carries `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`.
- **AC-004** — A `<Link to="/recipe/$id" viewTransition>` in the recipe list triggers a
  view-transition animation in Chromium; pressing the browser back button on the detail page
  triggers the `back-transition` slide animation via `useBackViewTransition`.
- **AC-005** — `GET /api/image/<uuid>` returns the R2 object with `Content-Type: image/webp`;
  `HEAD /api/video/<uuid>` returns headers only (no body).
- **AC-006** — Disconnecting the network in DevTools causes `<OfflineBanner />` to appear within
  one event loop tick after the `offline` event.
- **AC-007** — Throwing `notFound()` from a loader (e.g. recipe id not found) renders the root
  `NotFound` component, not a default browser 404.
- **AC-008** — Calling `useQuery(getRecipeListOptions())` inside `/` after navigating from another
  page returns cached data immediately (no loading flash) because the loader called
  `ensureQueryData` and `defaultPreload: 'intent'` prefetched on hover.

## 9. Test Automation Strategy

- **Unit** — Pure helpers like `getErrorMessage` in `/auth/login` are unit-testable with Vitest
  (`vp test`).
- **Component** — `useBackViewTransition` can be tested by mocking
  `document.startViewTransition` and dispatching synthetic `popstate` events with `capture: true`
  listeners.
- **E2E (recommended)** — Playwright/Cypress flows for:
  - signed-out home → click recipe card → detail page → browser back → list (verify back
    transition class toggles);
  - signed-out → `/recipe/new` → redirect to `/auth/login`;
  - signed-in → `/auth/login` → redirect to `/`;
  - `/api/image/<id>` and `/api/video/<id>` happy/sad paths.
- **Static** — `vp check` validates that every `createFileRoute` path matches its file location
  and that `Route.useLoaderData()` / `Route.useRouteContext()` types are consistent.

## 10. Rationale & Context

- **Per-request QueryClient.** A fresh QueryClient per `getRouter()` call prevents cross-request
  cache leakage on the worker. SSR-Query integration dehydrates this server-side cache and
  rehydrates it once on the client, after which a single long-lived client QueryClient backs all
  navigations.
- **`defaultPreload: 'intent'`.** Loaders are intentionally cheap (`ensureQueryData` only) so that
  hover-prefetch is safe. Heavier work (mutations, side effects) lives in server functions and
  mutation hooks (`./client-state.spec.md`).
- **`notFoundMode: 'root'`.** Nested `notFound()` semantics are simpler when there is exactly one
  rendered NotFound surface for the whole app.
- **`shellComponent` on root.** TanStack Start requires the root to render the entire HTML
  document during SSR; `shellComponent` is the supported escape hatch.
- **View transitions on `<Link>`.** Forward transitions are declarative; back transitions require
  the `useBackViewTransition` hook because `popstate` is not generated by `<Link>` clicks. The
  hook intercepts the _first_ popstate, redispatches it inside `document.startViewTransition`,
  and waits for the router's `onResolved` event so the new route is fully matched before the
  transition completes. Without this, the slide-back animation would race with route mounting.
- **Auth on `/settings` parent route.** Centralizing the `beforeLoad` redirect on
  `routes/settings.tsx` means `/settings/account`, `/settings/ingredients`, `/settings/users` all
  inherit the auth gate without each having to re-declare it.
- **Anonymous read for recipes.** Treating `/`, `/recipe/$id`, `/search` as public allows
  unauthenticated users to browse content while still hiding write affordances behind
  `authUser`/`isAdmin` UI checks. This is also why those routes carry HTTP cache headers — they
  are safe to cache at edges/CDN.
- **Service worker silent-fail.** Offline support is a progressive enhancement; a registration
  failure (e.g. browsers that reject module SW types) must not crash the app shell.

## 11. Cross-references

- [`./platform.spec.md`](./platform.spec.md) — Worker entry, Cloudflare bindings, SW emission via
  `tanstackSerwistPlugin`, R2 cache headers backing `/api/image/$id` and `/api/video/$id`.
- [`./server-functions.spec.md`](./server-functions.spec.md) — RPC contract used by mutations in
  routes (e.g. `useServerFn(initiateGoogleAuth)`, `useServerFn(logout)`) and by query options
  consumed in loaders.
- [`./client-state.spec.md`](./client-state.spec.md) — Query options factories
  (`getRecipeListOptions`, `getRecipeDetailsOptions`, etc.) and the SSR-Query integration that
  ties loaders to component-level `useQuery`/`useSuspenseQuery`.
- [`../architecture.spec.md`](../architecture.spec.md) — Top-level architecture diagram and the
  split between routes, features, and infrastructure.
- [`../file-structure.spec.md`](../file-structure.spec.md) — Where routes live in the repo and the
  project-wide file layout conventions.
