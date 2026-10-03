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

| Decision                    | Choice                                                                                         | Rationale                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `[KD-1]` Server records     | Void loader props own page data; small remaining APIs serve browser-only reads.                | Server data comes from authoritative reads without a browser query cache.        |
| `[KD-2]` Refresh identity   | Page actions refresh the current loader props in place.                                        | URL/history and local UI state survive refresh; there are no central query keys. |
| `[KD-3]` Durable UI state   | TanStack Store persists data-only selections through `persistedStore`.                         | IDs and quantities survive reload without copying server entities.               |
| `[KD-4]` Shareable state    | URL params/query/hash remain navigation input; search filters stay component-local.            | Only intentionally navigable values affect history.                              |
| `[KD-5]` Browser preference | Head script resolves the theme cookie, else system preference; toggle writes cookie and class. | SSR documents receive the theme before first paint without loader theme props.   |

## 4. Principles & Intents

- `[PI-1]` **One source per value** — loader props, HTTP response, URL, cookie, store, local state, or feature context has one owner.
- `[PI-2]` **Persist intent, not records** — stores contain identifiers and quantities; server reads supply records.
- `[PI-3]` **Context stays local** — feature context threads loader catalogues within a feature subtree;
  Void shared context carries cross-cutting identity and pathname.

## 5. Non-Goals

- `[NG-1]` A global store containing server records; this refines `client.spec.md` `[NG-1]`.
- `[NG-2]` Session tokens or authorization state in a browser store; those remain under
  `../server/auth.spec.md`.
- `[NG-3]` Durable storage for transient control state such as hover, dialog visibility, or a draft
  interaction.

## 6. Caveats

- `[C-1]` `persistedStore` handles absent storage and malformed JSON with the initial value, but does not catch
  localStorage read/write exceptions. Validation checks array-versus-non-array shape, not full schemas.
- `[C-2]` Rendered props remain snapshots until navigation, page refresh, or action refresh. Void's navigation
  prefetch cache is fresh for 30s and usable up to 1h with background revalidation; non-GET navigation/actions flush it.
- `[C-3]` Shopping-list requests retain one fulfilled promise per distinct selected-ID array within the
  document; they have no TTL or mutation invalidation. Failed promises are removed so a later render can retry.

## 7. High-Level Components

| Component           | Module type                                 | Responsibility                                    | Public API surface              |
| ------------------- | ------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| Page data           | `pages/**/*.server.ts`                      | Read records and return typed props               | `loader`, `InferProps`          |
| Page actions        | Pages + `src/lib/client/page-action.ts`     | Mutate and refresh regular-page props             | `usePageAction()`               |
| Persisted stores    | `src/stores/*.store.ts`                     | Durable IDs and quantities                        | Read hooks and exported actions |
| Persistence adapter | `src/lib/client/persisted-store.ts`         | Initial SSR snapshot and localStorage persistence | `persistedStore<T>()`           |
| Theme               | `void.config.ts`, `src/lib/client/theme.ts` | Resolve before paint and toggle                   | `ui-theme`, `toggleTheme`       |
| Hydration gate      | `src/hooks/use-is-hydrated.ts`              | Distinguish SSR/hydration from client-only intent | `useIsHydrated()`               |
| Feature context     | `src/features/*/contexts/*`                 | Thread loader catalogues                          | Feature provider and hook       |

## 8. Detailed Design

### 8.1 Placement rule

Database-backed page values arrive as loader props. Browser-only records use the remaining typed
HTTP clients, not persisted stores. URL values belong to navigation; device-local durable intent
belongs to stores; theme belongs to a cookie and the document class. Short-lived filters/dialog state
belongs to components; deep feature-only catalogue access belongs to a feature provider.

### 8.2 Loader data and routing

Loaders call server exports directly. Home and search receive the name-ordered recipe catalogue;
details receives the recipe and embedded instructions; editor pages provide ingredients and recipes
through catalogue providers. Regular page actions rerun page data without maintaining a parallel cache.
Browse documents receive new loader snapshots on navigation.

### 8.3 Persisted selection and derived data

`shopping-list` persists recipe IDs, `recipe-quantities` serving overrides, and `recent-recipes`
recent IDs. Hooks expose data-only Store snapshots and exported functions call `store.setState(...)`.
The shopping-list hook combines IDs, quantity overrides, and `loadRecipesByIds(ids)`, then runs
`aggregateShoppingList`. No recipe or aggregate records are written to localStorage.

### 8.4 Persistent-store contract

`persistedStore<T>(key, initial)` constructs a Store from saved JSON when storage exists, otherwise
the initial value, and serializes later changes. It discards malformed JSON and values whose
array/non-array shape differs from the initial value (including old wrapped array stores).
`useValue()` uses `useSyncExternalStore`: its server snapshot is always `initial`, including
hydration, then React reads the saved client snapshot. This prevents hydration mismatches.

`useIsHydrated()` likewise returns false for SSR/hydration and true on the client.
Shopping-list UI uses that gate before reading selected-recipe promises, rendering a neutral
skeleton on the server and a Suspense skeleton while selected recipes load.

| State question                     | Placement                          | Reason                                  |
| ---------------------------------- | ---------------------------------- | --------------------------------------- |
| Is the Worker the source of truth? | Loader props / remaining HTTP read | Server read determines current records. |
| Is it navigable?                   | URL input                          | Links/history carry the value.          |
| Is it browser-wide preference?     | Cookie and document class          | Theme applies before first paint.       |
| Is it durable personal intent?     | Persisted Store                    | Survives reload on one device.          |
| Is it a short interaction?         | Component state                    | No durable/global ownership needed.     |
| Does one feature subtree need it?  | Feature context                    | Avoids unrelated global wiring.         |

### 8.5 Refresh and mutation boundary

Regular-page callers use `usePageAction()` for page-owned mutations. It preserves URL/history,
refreshes props with local state preserved, alerts expected failures, and returns a success boolean.
Callers own navigation and closing effects; never await an action inside a React transition.

Inline ingredient creation retains `POST /api/ingredients`; `AddIngredient` calls
`router.refresh()` after success to refresh the catalogue props, then resets and closes its form.
The settings ingredient page owns update/delete actions. Recipe-details deletion uses
`submitAction(router, '/recipe/<id>', { method: 'POST', replace: true })` to follow the home redirect
and replace the deleted recipe's history entry. It does not use `usePageAction()`: that helper's
`preserveState: true` keeps the old URL even when the action redirects. Failed results use `alertError`.

### 8.6 Cookie, URL, local, and feature state

The inline head script in `void.config.ts` reads `ui-theme`, using `prefers-color-scheme` only
when the cookie is absent, and sets the light/dark document class before paint.
`toggleTheme()` flips that class and writes the cookie; no theme value travels through page props.
Session cookies remain server-authentication state.

Filters stay in `RecipeSearch` local state. Tabs expose native hash links; their hydrated handler
scrolls and replaces history. Feature catalogue providers accept loader props and do not create
another global server-data owner.

### 8.7 State contract summary

| Owner                  | Read surface                        | Write or refresh surface             |
| ---------------------- | ----------------------------------- | ------------------------------------ |
| Worker record          | Loader props / remaining API client | Page action or explicit page refresh |
| Durable browser intent | Store read hook                     | Exported store action                |
| URL value              | Page request / document URL         | Link or navigation                   |
| Theme preference       | Document class                      | Cookie-backed `toggleTheme`          |
| Ephemeral interaction  | Component hook                      | Event handler                        |
| Feature subtree value  | Feature context hook                | Loader-fed provider                  |

The header palette's `loadRecipeList()` fetches once on first open per document and clears rejected
promises. Shopping-list `loadRecipesByIds` retains promises keyed by serialized selections.
These are stable promises for React `use()`, not a query-cache lifecycle or persisted entity storage.

### 8.8 Outcome and acceptance

- `[SO-1]` Server records and personal browser intent have separate owners without hydration mismatch — demonstrated by `[VC-1]`.
- `[SO-2]` Writes refresh regular-page props without replacing navigation history — demonstrated by `[VC-2]`.
- `[VC-1]` Reload with saved quantities/selection/recents: server and hydration use initial snapshots,
  then saved values appear; shopping list shows its skeleton before client selection resolves —
  demonstrates `[SO-1]`.
- `[VC-2]` Update a regular-page record: refreshed props reflect the write with unchanged URL/history;
  add an ingredient inline and verify refreshed catalogue options — demonstrates `[SO-2]`.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                              | Sections affected | Reason                                                           |
| ---------- | -------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------- |
| 2026-09-13 | Specify Hono RPC clients as TanStack Query's server-data source.                       | 3, 8.5            | Reflect the migrated query and mutation wrappers.                |
| 2026-09-13 | Use an explicit browser Query provider.                                                | 3, 7, 8.1–8.2     | Replace the SSR-query bridge and isomorphic preference boundary. |
| 2026-09-18 | Describe current query prefetch and page-owned loading.                                | 8.2               | Match the query API and inline isLoading skeletons.              |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries. | Updated contracts | Reflect the completed page migration.                            |
| 2026-10-03 | Document navigation prefetch freshness and redirecting recipe deletion.                | 3, 6, 8.5         | Distinguish navigation caching from durable browser intent.      |
