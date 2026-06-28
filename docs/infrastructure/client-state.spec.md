---
title: Client State Layering Specification
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [infrastructure, state, tanstack-store, tanstack-query, ssr, persistence]
---

# Client State Layering Specification

This specification defines how state is partitioned and managed across the
recipe-organizer application. It enumerates the available state layers, the
order in which they must be considered, and the conventions that keep SSR
hydration, persistence, and server-data freshness consistent.

## 1. Purpose & Scope

The recipe-organizer is a TanStack Start application running on Cloudflare
Workers. It mixes server-rendered routes, client-only persistent UI state,
encrypted server sessions, and shared form context. This document specifies:

- The canonical state layers and their priority order.
- Where to put a given piece of state ("decision tree").
- The hydration model (loaders, `ensureQueryData`, client-only render mode).
- The conventions that prevent server/client mismatches and stale duplicates
  of server data.

In scope: client-side state organization, TanStack Query usage, TanStack
Store stores, URL search state, theme cookie, and feature-scoped React context.

Out of scope: encrypted server sessions (see `./server-functions.spec.md`),
form state internals (see `./forms.spec.md`), and the routing/SSR mechanics
themselves (see `./routing-ssr.spec.md`).

Audience: contributors and AI agents adding or modifying stateful behavior.

## 2. Definitions

- **Server state** — Data owned by the backend (D1 via Drizzle). Cached on
  the client by TanStack Query.
- **Persistent client-only state** — User-controlled, browser-local
  preferences (e.g., shopping list selection) stored in `localStorage` via
  the shared `persistedStore` helper (`src/lib/persisted-store.ts`).
- **URL/Search state** — State encoded in the URL via TanStack Router
  `validateSearch` (Zod schemas). Shareable, bookmarkable, SSR-safe.
- **Cookie state** — Isomorphic key/value pairs readable on both server and
  client. Used for theme; encrypted variants used for sessions.
- **Component-local state** — `useState`/`useReducer` for ephemeral UI.
- **Feature context** — React Context scoped to a single feature subtree
  (e.g., propagating a form's linked-recipe ids to descendant editors).
- **Query key** — A tuple identifying a server resource. All keys are
  produced by helpers in `src/lib/query-keys.ts`.
- **Loader** — A TanStack Router `loader`/`beforeLoad` function that runs
  before a route renders. With client-only render mode (below), child-route
  loaders run on the client; the root's `beforeLoad` runs on the server.
- **Client-only render mode** — `src/start.ts` sets `defaultSsr: false` and
  the root route opts back in with `ssr: true`. The worker renders only the
  document shell; all child-route content renders on the client. This removes
  the need for `<ClientOnly>` boundaries and the
  `'@tanstack/react-start/client-only'` directive. See `./routing-ssr.spec.md`.
- **`createIsomorphicFn`** — TanStack Start helper exposing a function
  with separate server and client implementations (`utils/cookie.ts`).

## 3. Requirements, Constraints & Guidelines

### Requirements

- **REQ-001:** Server data MUST be fetched and cached through TanStack
  Query. Direct `fetch`/server-function calls in components are prohibited.
- **REQ-002:** All TanStack Query keys MUST be produced by the helpers in
  `src/lib/query-keys.ts`. New keys MUST be added there.
- **REQ-003:** The `QueryClient` is constructed inside `getRouter()` in
  `src/router.tsx` with `gcTime = 24h` and `staleTime = 5m`.
- **REQ-004:** `setupRouterSsrQueryIntegration` MUST be called in
  `getRouter()` so that data prefetched in loaders via
  `context.queryClient.ensureQueryData(...)` hydrates the client.
- **REQ-005:** Persistent client-only state MUST live in `src/stores/*` as
  TanStack Store instances created via the shared `persistedStore` helper
  (`src/lib/persisted-store.ts`). Store files MUST NOT carry the
  `'@tanstack/react-start/client-only'` directive — under client-only render
  mode they are never rendered server-side, and `persistedStore` guards every
  `localStorage` access with `typeof localStorage !== 'undefined'`, so it
  tolerates the absence of `localStorage` during server module evaluation.
- **REQ-006:** Each store MUST hold DATA ONLY (no actions in state); actions
  are separate exported functions calling `store.setState(...)`. Because the
  state is data-only, the whole state is persisted — there is no `partialize`
  and nothing to exclude.
- **REQ-007:** URL/search state MUST be declared per-route via
  `validateSearch` using a Zod schema (e.g., the home route declares
  `searchSchema = z.object({ search: z.boolean().optional() })`).
- **REQ-008:** The UI theme MUST be read/written via `lib/theme.ts`,
  which uses the isomorphic `getCookie/setCookie` helpers from
  `src/utils/cookie.ts`. The theme MUST be resolved in the root
  `beforeLoad` and surfaced through route context.
- **REQ-009:** Server-encrypted session state MUST go through
  `useAppSession`/`useOAuthSession` (TanStack Start `useSession`). It MUST
  NOT be mirrored into a TanStack Store or React Context.
- **REQ-010:** Feature-scoped React Context (e.g., `LinkedRecipesProvider`
  in `src/features/recipe/contexts/linked-recipes-context.tsx`) MUST be
  used only for values that need to be threaded through a deep subtree
  within a single feature. Cross-feature contexts are prohibited.
- **REQ-011:** Components reading a store render normally inside
  their (client-only) route. They MUST NOT be wrapped in `<ClientOnly>`;
  client-only render mode already guarantees they never run during SSR, so
  there is no `localStorage`-backed hydration mismatch.
- **REQ-012:** Mutations MUST invalidate the affected query keys on
  success using `queryClient.invalidateQueries({ queryKey: ... })`.

### Constraints

- **CON-001:** Server data MUST NOT be duplicated into a store. The
  shopping list stores recipe ids only; recipes are loaded via
  `queryKeys.recipeListByIds(ids)`.
- **CON-002:** Stores are never read during SSR because the routes
  that consume them are client-only (`defaultSsr: false`). Do not move a
  store consumer into the root shell (`ssr: true`); doing so would read the
  server default (empty) and reintroduce a hydration mismatch.
- **CON-003:** Stores MUST hold only user-controlled data — never derived
  values, server data, or ephemeral UI state. Keep the store state shape
  minimal; everything in it is persisted (no `partialize`).
- **CON-004:** New global React Contexts are prohibited. Prefer route
  context (TanStack Router) for app-wide values, and feature-scoped
  Context for local subtree wiring.
- **CON-005:** Default `QueryClient` options MUST NOT be overridden
  per-query unless a specific resource requires it; document any
  override inline.
- **CON-006:** The router context shape (`authUser`, `queryClient`,
  `theme`) is the single source of cross-cutting state for routes. New
  fields MUST be justified and added to `createRootRouteWithContext`.

### Guidelines

- **GUD-001:** Prefer URL search state over a persistent store for anything
  a user might want to share, bookmark, or back/forward through.
- **GUD-002:** Prefer `useSuspenseQuery` in components rendered inside a
  route whose loader has already prefetched the resource via
  `ensureQueryData`. Use `useQuery` when the data is optional.
- **GUD-003:** Read a store through its dedicated `useSelector`-backed hook
  (e.g., `useShoppingListIds()`) rather than subscribing to unrelated state,
  to avoid unnecessary re-renders.
- **GUD-004:** Co-locate the `*Options(...)` query factories with the
  feature (e.g., `features/shopping-list/api/get-recipe-by-ids.ts`) and
  reference `queryKeys.*` from `src/lib/query-keys.ts`.

### Patterns

- **PAT-001:** _Loader prefetch + Suspense query._ Loader calls
  `context.queryClient.ensureQueryData(getXOptions(...))`; the component
  then calls `useSuspenseQuery(getXOptions(...))` and renders without a
  loading state.
- **PAT-002:** _Persisted store._ `persistedStore<T>(key, initial)` from
  `src/lib/persisted-store.ts` returns a data-only `Store<T>`; the file
  also exports a `useSelector`-based read hook and plain action functions
  that call `store.setState(...)`. Colocated under `src/stores/`. No
  client-only directive — consumers live in client-only routes.
- **PAT-003:** _Hybrid local + server._ Combine a store id list with a
  server query keyed by those ids. See
  `src/features/shopping-list/hooks/use-shopping-list.ts` (selection from
  store, recipes from `getRecipeByIdsOptions(shoppingList)`).
- **PAT-004:** _Isomorphic cookie._ Use `createIsomorphicFn().server(...)
.client(...)` to expose the same cookie API in loaders, server
  functions, and client code.
- **PAT-005:** _Route-context propagation._ Resolve cross-cutting values
  (`authUser`, `theme`) in `beforeLoad` and consume them via
  `Route.useRouteContext()` rather than React Context.

## 4. Architecture: The Three Layers

State priority order (when deciding where to put X, walk the list top to
bottom and stop at the first match):

1. **Server state** — TanStack Query. Source of truth: the database.
2. **Persistent client-only state** — TanStack Store stores via the
   `persistedStore` helper.
3. **URL/Search state** — TanStack Router `validateSearch` (Zod).
4. **Cookies** — Isomorphic for shareable preferences (theme); encrypted
   for sessions.
5. **Component-local state** — `useState`/`useReducer`.
6. **React Context** — feature-scoped only.

### 4.1 Server state — TanStack Query

- `QueryClient` constructed in `src/router.tsx` with:
  - `gcTime: 24h`
  - `staleTime: 5m`
- Wired to TanStack Router via `setupRouterSsrQueryIntegration` so loaders
  feed the same cache the client consumes.
- All query keys live in `src/lib/query-keys.ts` (`queryKeys.allRecipes`,
  `queryKeys.recipeListByIds(ids)`, `queryKeys.listIngredients()`, etc.).
- Mutations invalidate the affected key on success.

### 4.2 Persistent client-only state — TanStack Store

Stores live under `src/stores/`, each created with the shared
`persistedStore` helper and exporting a data-only store instance, a
`useSelector`-based read hook, and plain action functions:

- `recipe-quantities.store.ts` — `recipeQuantitiesStore`
  (`Record<recipeId, number>` of user-overridden serving counts) persisted
  under key `recipe-quantities`. Hook `useRecipeQuantitiesState()`; action
  `setRecipesQuantities(id, qty)`.
- `shopping-list.store.ts` — `shoppingListStore` (`number[]` of recipe ids
  selected for the shopping list) persisted under key `shopping-list`. Hook
  `useShoppingListIds()`; actions `addToShoppingList(id)`,
  `removeFromShoppingList(id)`, `resetShoppingList()`.
- `recent-recipes.store.ts` — `recentRecipesStore` (`number[]` of recently
  opened recipe ids, capped at 10) persisted under key `recent-recipes`.
  Hook `useRecentRecipeIds()`; action `addRecentRecipe(id)`.

The whole state is data-only, so it is persisted in full — there is no
`partialize`. These are plain modules (no client-only directive). Their
consumers (`routes/shopping-list.tsx`, the `QuantityControls` block in
`recipe-card.tsx`, etc.) live in client-only routes, so the stores are only
ever read on the client — no `<ClientOnly>` boundary is needed.

### 4.3 URL/Search state — TanStack Router

Each route declaring search params uses `validateSearch` with a Zod
schema. Example: the home route uses
`searchSchema = z.object({ search: z.boolean().optional() })` to drive
the visibility of the search bar. Search state is shareable, SSR-safe,
and survives back/forward navigation.

### 4.4 Cookies

- **Theme** — `lib/theme.ts` reads/writes the `ui-theme` cookie via
  `utils/cookie.ts`. The cookie is read in the root `beforeLoad` and
  surfaced through route context (consumed via `Route.useRouteContext()`
  in `__root.tsx`).
- **Sessions** — Server-encrypted cookies via
  `useAppSession`/`useOAuthSession` (see `./server-functions.spec.md`
  and the auth feature spec).

### 4.5 Component-local state

`useState`/`useReducer` for ephemeral UI: open/closed dialogs, search
input values, swipe drag state, hover, etc. Do not promote any of this
to a global store.

### 4.6 React Context (feature-scoped)

Used only when a value must be threaded through a deep feature subtree.
Current example: `LinkedRecipesProvider`
(`src/features/recipe/contexts/linked-recipes-context.tsx`) propagates
the current form's `linkedRecipeIds` to nested editor components. The
provider is mounted inside the recipe editor; consumers call
`useLinkedRecipes()` and receive `[]` outside the provider.

## 5. Hydration Model

- Loaders prefetch via `context.queryClient.ensureQueryData(getXOptions(...))`.
  Because `setupRouterSsrQueryIntegration` is wired in `getRouter()`, the
  prefetched data crosses the SSR boundary and lands in the client cache.
- Components use `useSuspenseQuery(getXOptions(...))` (or `useQuery` for
  optional data) — they do not refetch when the loader has already populated
  the cache within `staleTime` (5m).
- Mutations call `queryClient.invalidateQueries({ queryKey: ... })` on
  success to trigger background refetch.
- Stores depend on `localStorage`. Because their consumers live in
  client-only routes (`defaultSsr: false`), they are only read on the client,
  so there is no SSR default to mismatch — no `<ClientOnly>` is needed. The
  `persistedStore` helper also guards `localStorage` access, so the module
  evaluates harmlessly on the server.
- Cookie-backed values (theme) are read isomorphically and pass through
  route context; they render in the SSR'd root shell (`ssr: true`).

## 6. State Ownership Table

| State                                             | Layer                   | Mechanism                                                                     | Notes                                                          |
| ------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Auth user                                         | Route context           | `beforeLoad` in `__root.tsx` resolving `getAuthUser()`                        | Surfaced via `Route.useRouteContext().authUser`.               |
| Recipe list                                       | Server state            | `useQuery(getRecipeListOptions())` keyed by `queryKeys.recipeList()`          | Loader prefetches via `ensureQueryData`.                       |
| Recipe detail                                     | Server state            | `useSuspenseQuery` keyed by `queryKeys.recipeDetail(id)`                      | Loader prefetches by id.                                       |
| Recipe instructions                               | Server state            | `queryKeys.recipeInstructions(id)`                                            | Independent key for partial reload.                            |
| Ingredient list/detail                            | Server state            | `queryKeys.listIngredients()`, `queryKeys.detailIngredient(id)`               |                                                                |
| Theme                                             | Cookie + route context  | `ui-theme` cookie via `lib/theme.ts`, surfaced in route context               | SSR-safe; toggles via `toggleTheme()`.                         |
| Selected recipes for shopping list                | Persistent client-only  | `shoppingListStore` / `useShoppingListIds()` (`number[]`)                     | Stores ids only; recipes via `queryKeys.recipeListByIds(ids)`. |
| Quantities per recipe                             | Persistent client-only  | `recipeQuantitiesStore` / `useRecipeQuantitiesState()` (`Record<id, number>`) | Falls back to recipe `servings`.                               |
| Editor toolbar state (e.g., active formatting)    | Component-local         | `useState`                                                                    | Ephemeral.                                                     |
| Linked recipe ids (within editor)                 | Feature context         | `LinkedRecipesProvider`                                                       | Scoped to the recipe form subtree.                             |
| Dialog open/close                                 | Component-local         | `useState`                                                                    | Ephemeral.                                                     |
| Route search params (e.g., search bar visibility) | URL/Search              | `validateSearch` Zod schema                                                   | Shareable/bookmarkable.                                        |
| Session (auth tokens)                             | Server-encrypted cookie | `useAppSession`/`useOAuthSession`                                             | See `./server-functions.spec.md`.                              |

## 7. Decision Tree: Where Do I Put X?

```
Q1. Does the value live in the database?
    └── Yes → TanStack Query (queryKeys.*). Loader prefetches; component
              uses useSuspenseQuery / useQuery. Mutations invalidate.
    └── No  → continue.

Q2. Should it be shareable, bookmarkable, or survive back/forward
    navigation (e.g., filters, tabs, "search bar open")?
    └── Yes → URL search state via validateSearch + Zod.
    └── No  → continue.

Q3. Must it survive page reload as a user-controlled preference, with
    no need to share it across devices?
    └── Yes → Persistent TanStack Store under src/stores/, created via the
              persistedStore helper (data-only state; whole state persisted,
              no partialize). Consumers render normally (client-only routes;
              no <ClientOnly> needed).
    └── No  → continue.

Q4. Must it be readable on the server (SSR loaders, server functions)?
    └── Theme-like preference        → Isomorphic cookie via
                                       utils/cookie.ts (lib/theme.ts pattern).
    └── Authenticated session/token  → Server-encrypted cookie via
                                       useAppSession/useOAuthSession.
    └── Otherwise                    → continue.

Q5. Is the value ephemeral UI (open/closed, hover, draft input)?
    └── Yes → useState / useReducer in the owning component.
    └── No  → continue.

Q6. Does a deep feature subtree need this value without prop drilling,
    AND it doesn't fit any layer above?
    └── Yes → Feature-scoped React Context, colocated under
              src/features/<feature>/contexts/.
    └── No  → reconsider; you probably don't need new state.
```

Defaults when unsure:

- Server-shaped data → TanStack Query.
- User selection of server entities → ids-only persistent store + server query.
- Cross-cutting preference visible to SSR → cookie + route context.

## 8. Acceptance Criteria

- **AC-001:** Given a route with a loader prefetching `getXOptions`,
  When the route renders on the client,
  Then the corresponding component using `useSuspenseQuery(getXOptions)`
  resolves synchronously without a loading boundary trigger.
- **AC-002:** Given a store consumer in a client-only route, When
  the user reloads the page, Then the worker returns the shell (empty
  `<main>`), the persisted value is restored from `localStorage` on the
  client, and there are no hydration warnings in the console.
- **AC-003:** Given a successful mutation invalidating
  `queryKeys.recipeList()`, When the recipe list is visible,
  Then it refetches in the background and shows the updated data.
- **AC-004:** Given a user toggles the theme,
  When the page is reloaded or another route is visited,
  Then `__root.tsx` renders with the previously selected theme on the
  first paint (SSR), with no flicker.
- **AC-005:** Given the shopping list contains recipe ids `[1, 2]`,
  When `useShoppingList()` runs,
  Then the recipes are loaded via `queryKeys.recipeListByIds([1, 2])`
  and the store still contains only `[1, 2]` (no server data duplication).
- **AC-006:** Given a new piece of server data is added,
  When a developer adds the query helper,
  Then a corresponding key exists in `src/lib/query-keys.ts` and is the
  only place that key is constructed.

## 9. Test Automation Strategy

- **Unit tests (Vitest via `vp test`)**:
  - Store action functions: add → list contains id; remove → id removed;
    reset → empty array; quantity setter overwrites. Assert against
    `store.state` after calling the action.
  - `getTheme()` returns `'light'` when the cookie is missing; toggling
    flips between `'dark'` and `'light'`.
  - `queryKeys.recipeListByIds(ids)` is stable for the same input and
    distinct from `queryKeys.recipeList()`.
- **Integration tests**:
  - Loader prefetch + `useSuspenseQuery` round-trip for a representative
    route (e.g., recipe detail).
  - `useShoppingList()` with a stubbed query returns the merged
    `recipesWithQuantities` shape.
- **SSR smoke**:
  - Verify the worker returns the shell with an empty `<main>` for a
    store-backed route (e.g. `/shopping-list`) and that the build/runtime
    does not throw (the `persistedStore` helper guards `localStorage`, so it
    tolerates its absence when the store module is evaluated server-side).
- **Manual checks before merge**: `vp check` (format, lint, types) and
  `vp test`.

## 10. Rationale & Context

- Three explicit layers prevent the typical Redux-style temptation to
  pull everything into a single global store. Each layer maps to a
  well-defined hydration story.
- A single TanStack `QueryClient` shared between SSR loaders and the
  client cache eliminates double-fetching and keeps data fresh under a
  short `staleTime` (5m) with a long `gcTime` (24h) for offline-friendly
  navigation.
- Centralizing query keys in `src/lib/query-keys.ts` makes invalidation
  predictable and lets refactors stay local to one file.
- Stores are kept narrow and id-shaped (shopping list ids, quantities by
  id) so server data is never copied into the client store. Server data
  stays in the query cache where invalidation works.
- Client-only render mode (`defaultSsr: false`) eliminates the most common
  SSR hydration mismatch class outright: store-backed page content never
  renders on the server, so no `client-only` directive or `<ClientOnly>`
  boundary is required.
- Theme is intentionally a cookie rather than a persistent store because it
  must be readable during SSR to render `<html className={theme}>`
  without a flash of incorrect theme.
- Feature-scoped Context is allowed but bounded: cross-feature wiring
  goes through route context, server queries, or persistent stores.

## 11. Dependencies & External Integrations

### Libraries

- **LIB-001:** `@tanstack/react-query` — server-state cache.
- **LIB-002:** `@tanstack/react-router` and
  `@tanstack/react-router-ssr-query` — routing, route context, and the
  SSR/Query bridge (`setupRouterSsrQueryIntegration`).
- **LIB-003:** `@tanstack/react-start` — isomorphic helpers
  (`createIsomorphicFn`), sessions (`useSession`), and `createStart`
  (`src/start.ts`, `defaultSsr: false`).
- **LIB-004:** `@tanstack/react-store` (0.11) — `Store` + `useSelector`
  for persistent client-only stores (via the shared `persistedStore`
  helper). Already present transitively via TanStack React Form/Router.
- **LIB-005:** `zod` — schema validation for `validateSearch` and
  request payloads.

### Platform

- **PLT-001:** Cloudflare Workers runtime (D1 for persistence; HTTP
  cookies for theme/session). See `./platform.spec.md`.

### Cross-references

- [`./server-functions.spec.md`](./server-functions.spec.md)
- [`./routing-ssr.spec.md`](./routing-ssr.spec.md)
- [`./forms.spec.md`](./forms.spec.md)
- [`../architecture.spec.md`](../architecture.spec.md)
- [`../../src/features/shopping-list/shopping-list.spec.md`](../../src/features/shopping-list/shopping-list.spec.md)
- [`../../src/features/recipe/spec/index.spec.md`](../../src/features/recipe/spec/index.spec.md)
