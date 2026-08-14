---
title: Recipe Search
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
related: [docs/architecture.spec.md]
---

## 2. Problem Statement

Cooks need a focused way to find a recipe by name and narrow the catalogue by meal, cuisine, and
recipe characteristics. The search screen combines instant local filtering with a browser-local
history of opened results, making repeat visits quick without duplicating recipe records.

- `[G-1]` Let a cook narrow the cached recipe catalogue through accent-insensitive text and combined filters.
- `[G-2]` Make an unfiltered search screen useful by presenting recently opened recipes in recency order.
- `[G-3]` Keep discovery responsive while preserving the recipe list as the authoritative server-data contract.

## 3. Key Design Decisions

| Decision                    | Choice                                                                                                              | Rationale                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Filtering location | The browser filters the React Query recipe-list result.                                                             | Typing and toggle changes produce no Worker round trip, and the list remains available to an already-loaded client. |
| `[KD-2]` Text comparison    | Both query and recipe name use NFD diacritic removal and lowercase comparison.                                      | French names match regardless of case or accents without an i18n dependency.                                        |
| `[KD-3]` Filter semantics   | Selected meals and cuisines are each AND-combined; vegetarian, Magimix, and spice values act as boolean predicates. | Multiple selections consistently narrow results while the spice toggle controls whether spice recipes are visible.  |
| `[KD-4]` Recent state       | The persisted store retains recipe IDs only, most-recent-first, capped at ten.                                      | IDs avoid stale recipe snapshots and resolve against the fresh query result.                                        |
| `[KD-5]` Default content    | No active filters displays resolved recents, falling back to non-spice catalogue rows.                              | The screen supports repeat discovery without presenting an empty first-use state.                                   |

## 4. Principles & Intents

- `[PI-1]` **Server records stay in Query** — refine architecture [PI-4]; the search store contains IDs,
  never recipe objects.
- `[PI-2]` **Filters stay local** — query text and selections describe one screen interaction and do not
  become URL state.
- `[PI-3]` **Selection is explicit** — a filter only narrows results when the corresponding value is set;
  an empty text query matches every name.
- `[PI-4]` **Open history is personal** — recent recipes are browser-local convenience state rather than
  shared product data.

## 5. Non-Goals

- `[NG-1]` Ingredient-name matching, ranking, fuzzy matching, pagination, sorting controls, or server-side search.
- `[NG-2]` URL-persisted filters or filters shared between devices.
- `[NG-3]` Recording visits outside search or retaining full recipe snapshots in browser storage.
- `[NG-4]` A search-index service; see architecture [OQ-1] for the product-wide scaling decision.

## 6. Caveats

- `[C-1]` Results are limited to the projection returned by the recipe-list server function, which contains
  recipe display fields but no ingredient names (`src/features/recipe/api/get-all.ts:10-38`).
- `[C-2]` Recent IDs may no longer resolve when a recipe is deleted; rendering skips them and uses the
  catalogue fallback when none resolve (`src/features/search/components/recent-recipes.tsx:19-25`).
- `[C-3]` The route uses `ssr: 'data-only'`, so its screen components render through client-side data
  handling rather than as full route HTML (`src/routes/search.tsx:103-108`).

## 7. High-Level Components

```text
/search route loader ──▶ getRecipeListOptions() ──▶ Query cache
       │                                              │
       ▼                                              ▼
local filter state ──▶ filterRecipes() ──▶ results / empty state
       │                                              │
       └── no active filters ──▶ recent ID store ──▶ resolved cards
```

| Component        | Module type                            | Responsibility                                                     | Public API surface                  |
| ---------------- | -------------------------------------- | ------------------------------------------------------------------ | ----------------------------------- |
| Search route     | TanStack file route                    | Prefetch recipe data and compose controls with content             | `/search`                           |
| Filter utilities | Pure feature utility                   | Normalise names and apply text/attribute predicates                | `filterRecipes`, `hasActiveFilters` |
| Search results   | React component                        | Render matched rows, count, clear action, and shopping-list action | `SearchResults`                     |
| Recent recipes   | Persisted TanStack Store and component | Retain IDs and resolve them to live recipe rows                    | `addRecentRecipe`, `RecentRecipes`  |
| Search card      | React component                        | Link a row to a recipe and record its opening                      | `RecipeSearchCard`                  |

## 8. Detailed Design

### 8.1 Search route

The `/search` loader prefetches `getRecipeListOptions()` and the component reads that same query.
The page maintains one `SearchFilters` value containing `query`, arrays of `cuisineTypes` and
`meals`, plus `isVegetarian`, `isMagimix`, and `isSpice` flags
(`src/routes/search.tsx:32-36`; `src/features/search/utils/filter.ts:5-15`). A collapsible panel
holds multi-select meal and cuisine controls and the three boolean toggles
(`src/routes/search.tsx:42-92`).

`EMPTY_FILTERS` supplies an empty query, empty arrays, and disabled booleans. The clear action
restores precisely that value, making the default-content branch the single outcome of clearing
(`src/features/search/utils/filter.ts:11-15`; `src/routes/search.tsx:39-40`).

When any filter is active, the page renders filtered results. Otherwise it passes only non-spice
rows to recents, maintaining the default spice-hiding policy (`src/routes/search.tsx:37-39`; `src/routes/search.tsx:94`).

### 8.2 Filter utilities

`normalize()` decomposes Unicode with NFD, strips diacritic code points, and lowercases the result
(`src/features/search/utils/normalize.ts:1-5`). The query predicate trims its input, then normalises
it and matches a substring of the normalised name. The attribute predicate requires every selected cuisine
and meal, requires each enabled boolean characteristic, and excludes spice recipes until the spice
filter is enabled (`src/features/search/utils/filter.ts:17-35`). `filterRecipes()` joins those
predicates; `hasActiveFilters()` treats every non-empty or enabled filter as active
(`src/features/search/utils/filter.ts:13-15`; `src/features/search/utils/filter.ts:37-38`).

| Filter value                | Match rule                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| `query`                     | Normalised recipe name contains the trimmed, normalised query; an empty query matches all names. |
| `cuisineTypes`              | Recipe contains every selected cuisine.                                                          |
| `meals`                     | Recipe contains every selected meal.                                                             |
| `isVegetarian`, `isMagimix` | An enabled value requires the matching recipe characteristic.                                    |
| `isSpice`                   | Enabled includes spice recipes; disabled excludes them.                                          |

### 8.3 Results and interaction

`SearchResults` renders a French no-match state with an action that resets all filters. Matched rows
retain list order, show a count, and offer a shopping-list action when appropriate
(`src/features/search/components/search-results.tsx:16-55`). The source recipe query orders rows by
name, so the feature does not impose a competing sort (`src/features/recipe/api/get-all.ts:23-38`).

The result action consults shopping-list membership: an included recipe shows a confirmation marker;
an absent recipe exposes an add control. That control is independent of card navigation, which
continues to capture the recent-recipe visit (`src/features/search/components/search-results.tsx:13-34`; `src/features/search/components/recipe-search-card.tsx:19-29`).

### 8.4 Recent recipes

The store persists `number[]` under `recent-recipes`. `addRecentRecipe(id)` prepends an ID, removes
its prior occurrence, and retains ten entries; a separate action clears the history
(`src/stores/recent-recipes.store.ts:5-14`). `RecentRecipes` resolves IDs in stored order against the
query result, omits stale IDs, and displays the supplied catalogue when resolution yields no rows
(`src/features/search/components/recent-recipes.tsx:19-37`).

The store exposes its array through a selector hook, keeping persistence mechanics outside the page
component (`src/stores/recent-recipes.store.ts:7-9`). The visible history header includes the French
clear control only when at least one recent row resolves (`src/features/search/components/recent-recipes.tsx:27-35`).

No active filter selects the recent-recipes branch. A resolved history retains its stored recency
order; an empty or entirely stale history renders the non-spice catalogue supplied by the route.
This keeps the default screen populated without promoting stale browser state into recipe data.

### 8.5 Search card

Every search card links to `/recipe/$id` with a view transition and records the ID on activation
(`src/features/search/components/recipe-search-card.tsx:19-29`). The card renders the recipe image,
name, and attribute badges from the recipe projection (`src/features/search/components/recipe-search-card.tsx:30-59`).

The optional action slot lets filtered results add a recipe to the shopping list without changing the
navigation contract (`src/features/search/components/search-results.tsx:12-15`; `src/features/search/components/recipe-search-card.tsx:7-10`).

## 9. Open Questions

N/A
