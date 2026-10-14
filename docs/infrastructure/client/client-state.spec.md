---
title: Client State
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/client/client.spec.md
related:
  [
    docs/infrastructure/client/routing-ssr.spec.md,
    docs/infrastructure/client/forms.spec.md,
    docs/infrastructure/server/data-layer.spec.md,
    docs/infrastructure/server/server-functions.spec.md,
    docs/infrastructure/server/auth.spec.md,
  ]
---

## 2. Problem Statement

The browser holds server records, durable personal selections, navigable URL values, and ephemeral
interaction state with different owners and lifetimes. A clear placement rule prevents stale copies
of Worker-owned data while preserving responsive, device-local interactions.

## 3. Key Design Decisions

| Decision                    | Choice                                                                                         | Rationale                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `[KD-1]` Server records     | `@tanstack/svelte-query` owns all server records, including session.                           | One in-memory query cache shares authoritative API reads across screens. |
| `[KD-2]` Refresh identity   | Feature mutation options invalidate the central query-key tree.                                | Active queries refetch; UI intent survives without copied entity stores. |
| `[KD-3]` Durable UI state   | A custom rune store persists data-only selections through `persistedStore`.                    | IDs and quantities survive reload without copying server entities.       |
| `[KD-4]` Shareable state    | URL params/query/hash remain navigation input; search filters stay component-local.            | Only intentionally navigable values affect history.                      |
| `[KD-5]` Browser preference | Head script resolves the theme cookie, else system preference; toggle writes cookie and class. | The static document receives its theme before first paint.               |

## 4. Principles & Intents

- `[PI-1]` **One source per value** — query cache, URL, cookie, store, local state, or feature context has one owner.
- `[PI-2]` **Persist intent, not records** — stores contain identifiers and quantities; server reads supply records.
- `[PI-3]` **Context stays local** — feature context threads query-backed catalogues within a feature subtree;
  session queries and router location carry cross-cutting identity and pathname.

## 5. Non-Goals

- `[NG-1]` A global entity store alongside the query cache; this refines `client.spec.md` `[NG-1]`.
- `[NG-2]` Session tokens or authoritative authorization state in a browser store; those remain under
  `../server/auth.spec.md`.
- `[NG-3]` Durable storage for transient control state such as hover, dialog visibility, or a draft
  interaction.

## 6. Caveats

- `[C-1]` `persistedStore` handles absent storage and malformed JSON with the initial value, but does not catch
  localStorage read/write exceptions. Validation checks array-versus-non-array shape, not full schemas.
- `[C-2]` Queries are fresh for 5 minutes and retained unused for 24 hours. Stale cached route data
  commits immediately while refreshing in the background; no cache persists across documents.
- `[C-3]` Selected-recipe queries share recipe-key invalidation. Empty shopping-list selection makes
  no request; local selection still precedes its data query.

## 7. High-Level Components

| Component           | Module type                                | Responsibility                            | Public API surface                |
| ------------------- | ------------------------------------------ | ----------------------------------------- | --------------------------------- |
| Query client        | `src/lib/client/query-client.ts`           | Shared in-memory server-record cache      | `queryClient`                     |
| Query keys          | `src/lib/client/query-keys.ts`             | Cache identity and invalidation prefixes  | `queryKeys`                       |
| Feature API options | `src/features/*/client/api/<operation>.ts` | Typed reads/writes and invalidation       | `queryOptions`, `mutationOptions` |
| Persisted stores    | `src/stores/*.store.svelte.ts`             | Durable IDs and quantities                | Read hooks and exported actions   |
| Persistence adapter | `src/lib/client/persisted-store.svelte.ts` | Device-local persistence                  | `persistedStore<T>()`             |
| Theme               | `index.html`, `src/lib/client/theme.ts`    | Resolve before paint and toggle           | `ui-theme`, `toggleTheme`         |
| Mount gate          | `src/hooks/use-is-hydrated.svelte.ts`      | Retained always-client compatibility hook | `useIsHydrated()`                 |
| Feature context     | Feature client providers                   | Thread query-backed catalogues            | Feature provider and hook         |

## 8. Detailed Design

### 8.1 Placement rule

Database-backed values live only in the query cache, consumed through feature query options.
URL values belong to navigation; device-local durable intent belongs to stores; theme belongs to
a cookie and the document class. Short-lived filters/dialog state belongs to components; deep
feature-only catalogue access belongs to a feature provider, not another server-data owner.

### 8.2 Query data and routing

```ts
// src/lib/client/query-client.ts
export const queryClient: QueryClient
// defaultOptions.queries: { staleTime: 5 * 60_000, gcTime: 24 * 60 * 60_000 }

// src/lib/client/query-keys.ts
export const queryKeys: {
  session: readonly ['session']
  allIngredients: readonly ['ingredients']
  ingredientList: () => readonly ['ingredients', 'list']
  allRecipes: readonly ['recipes']
  recipeList: () => readonly ['recipes', 'list', 'all']
  recipeListByIds: (ids: readonly number[]) => readonly ['recipes', 'list', readonly number[]]
  recipeDetail: (id: number) => readonly ['recipes', 'detail', number]
  allUsers: readonly ['users']
  userList: (status: 'active' | 'blocked' | 'pending') => readonly ['users', 'list', string]
}
```

Each feature owns `client/api/<operation>.ts` exporting query or mutation options that call
`readResponse(fetch(...))` from `void/client`. Home, search and palette share `recipeList`;
details queries include embedded instructions. Editor preloads supply ingredient and recipe
catalogues through feature providers. The router awaits `ensureQueryData` before committing;
cached stale data renders immediately and refreshes in the background.
`GET /api/session` returns `{ email, role, status } | null` under `['session']`; one document-local
session read is shared by guards and affordances, rather than resolving identity per document route.

### 8.3 Persisted selection and derived data

`shopping-list` persists recipe IDs, `recipe-quantities` serving overrides, and `recent-recipes`
recent IDs. Hooks expose data-only store snapshots and exported functions call the store's `setState(...)`.
The shopping-list hook combines IDs, quantity overrides, and the `recipeListByIds(ids)` query, then runs
`aggregateShoppingList`. No recipe or aggregate records are written to localStorage.

### 8.4 Persistent-store contract

`persistedStore<T>(key, initial)` holds a module-level value read from saved JSON when storage exists,
otherwise the initial value, and serializes later changes. It discards malformed JSON and values whose
array/non-array shape differs from the initial value (including old wrapped array stores).

The retained initial-snapshot and `useIsHydrated()` paths now run only on the client; simplifying
them is out of scope. Shopping-list UI reads device-local selection before querying selected recipes
and retains explicit pending/error state for this local-only load.

| State question                     | Placement                 | Reason                               |
| ---------------------------------- | ------------------------- | ------------------------------------ |
| Is the Worker the source of truth? | Query cache               | API reads determine current records. |
| Is it navigable?                   | URL input                 | Links/history carry the value.       |
| Is it browser-wide preference?     | Cookie and document class | Theme applies before first paint.    |
| Is it durable personal intent?     | Persisted store           | Survives reload on one device.       |
| Is it a short interaction?         | Component state           | No durable/global ownership needed.  |
| Does one feature subtree need it?  | Feature context           | Avoids unrelated global wiring.      |

### 8.5 Refresh and mutation boundary

Callers use `createMutation` with feature mutation options. `onSuccess` invalidates affected
prefixes; callers await mutations before closing/resetting or navigating.

| Mutation                          | Invalidates                    | Then                                                  |
| --------------------------------- | ------------------------------ | ----------------------------------------------------- |
| Create recipe                     | `allRecipes`                   | navigate to `/` with replace                          |
| Update recipe                     | `allRecipes`                   | navigate to `/recipe/<id>` with replace               |
| Delete recipe                     | `allRecipes`                   | navigate to `/` with replace so Back cannot reopen it |
| Create, update, delete ingredient | `allIngredients`, `allRecipes` | close the dialog                                      |
| Create, approve, block user       | `allUsers`                     | close the dialog or stay                              |
| Sign out                          | none                           | `location.assign('/auth/login')` resets the cache     |

Ingredient writes invalidate recipes because detail and shopping-list rows embed ingredient names.
Sign-in uses the OAuth redirect and reloads the document, resetting session and the in-memory cache.
No persisted query cache or browser write queue exists.

### 8.6 Cookie, URL, local, and feature state

The inline head script in `index.html` reads `ui-theme`, using `prefers-color-scheme` only
when the cookie is absent, and sets the light/dark document class before paint.
`toggleTheme()` flips that class and writes the cookie; no theme value travels through server props.
Session cookies remain server-authentication state.

Filters stay in `RecipeSearch` local state. Tabs expose native hash links; their mounted handler
scrolls and replaces history. Feature catalogue providers accept query-backed rows and do not create
another global server-data owner.

### 8.7 State contract summary

| Owner                  | Read surface          | Write or refresh surface                      |
| ---------------------- | --------------------- | --------------------------------------------- |
| Worker record          | Feature query options | Feature mutation options and key invalidation |
| Session affordance     | Session query         | OAuth/sign-out document reload                |
| Durable browser intent | Store read hook       | Exported store action                         |
| URL value              | `router.current.url`  | Anchor or `router.navigate`                   |
| Theme preference       | Document class        | Cookie-backed `toggleTheme`                   |
| Ephemeral interaction  | Component state       | Event handler                                 |
| Feature subtree value  | Feature context hook  | Query-fed provider                            |

The palette and shopping list share the query cache and its invalidation rather than retaining
independent fulfilled promises. Their loading/error feedback does not persist records or aggregates.

### 8.8 Outcome and acceptance

- `[SO-1]` Server records and personal browser intent have separate owners; query data is document-local
  and selections survive reload — demonstrated by `[VC-1]`.
- `[SO-2]` Writes invalidate all affected cached projections without unwanted history entries —
  demonstrated by `[VC-2]`.
- `[VC-1]` Reload with saved quantities/selection/recents: saved intent appears and API records are
  queried anew. Revisit a stale cached route: it renders immediately with a background refetch —
  demonstrates `[SO-1]`.
- `[VC-2]` Create/update/delete a recipe: home, search and affected detail reflect the write.
  Rename an ingredient: catalogue, recipe detail and shopping list update without reload while
  entered editor values survive. User mutations refresh all status panels. Delete replaces
  navigation home so Back cannot reopen the recipe — demonstrates `[SO-2]`.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                                            | Sections affected | Reason                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------- |
| 2026-09-13 | Specify Hono RPC clients as TanStack Query's server-data source.                                     | 3, 8.5            | Reflect the migrated query and mutation wrappers.                |
| 2026-09-13 | Use an explicit browser Query provider.                                                              | 3, 7, 8.1–8.2     | Replace the SSR-query bridge and isomorphic preference boundary. |
| 2026-09-18 | Describe current query prefetch and page-owned loading.                                              | 8.2               | Match the query API and inline isLoading skeletons.              |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries.               | Updated contracts | Reflect the completed page migration.                            |
| 2026-10-03 | Document navigation prefetch freshness and redirecting recipe deletion.                              | 3, 6, 8.5         | Distinguish navigation caching from durable browser intent.      |
| 2026-10-04 | Replace `useSyncExternalStore` stores and React `use()` with rune stores and explicit pending state. | 3, 7–8            | Match the shipped Svelte state conventions.                      |
