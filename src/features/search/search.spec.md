---
title: Recipe Search & Filter Feature Specification
version: 1.2
date_created: 2026-06-05
last_updated: 2026-06-05
owner: recipe-organizer
tags: [feature, search, filter, recipe, discovery, recent]
---

# Introduction

This specification defines the **search & filter** feature served at the `/search` route. It extends the current
name-only search into a recipe-discovery surface that combines a normalized (accent/case-insensitive) free-text
**name** query with multi-select **tag** filters, renders an explicit empty/no-results state with a clear-all
affordance, and surfaces a **recent recipes** shortlist (recipes the user recently opened from `/search`, persisted in
`localStorage`) as the default content when no filters are active. It is the authoritative, self-contained reference
for the feature; an agent SHOULD NOT need to read the source to implement or modify it.

## 1. Purpose & Scope

### 1.1 Purpose

Let a user quickly reach a recipe on `/search` by typing a name query and/or toggling tags, with clear feedback when
nothing matches, and — when idle (no filters) — jump back into recipes they recently opened.

### 1.2 In Scope (v1)

- A free-text query that matches against the recipe **name** only, accent- and case-insensitively.
- Multi-select **tag** filtering over the union of `RECIPE_TAGS` and `AUTO_TAGS`, AND-combined.
- An explicit empty/no-results state and a "clear all filters" affordance.
- A **recent recipes** shortlist persisted in `localStorage`: a recipe is recorded when opened from the `/search`
  results, and the shortlist is shown as the default page content while no filters are active (capped at 10).
- Promotion of the search page into a dedicated feature module at `src/features/search/`.

### 1.3 Out of Scope / Deferred

- **Ingredient-name search** — deferred to a later version; v1 does NOT modify `getRecipeListOptions` and does NOT
  surface ingredient names client-side (see §7.2, §11).
- Recording or displaying recents in the **command palette** (`SearchBar`, ⌘/Ctrl+K); v1 records only from `/search`.
- A **clear-history** affordance and a `clearRecentRecipes` store action.
- Persisting filter state in the URL / route search params (filters live in component state only).
- Server-side or cross-device persistence of recent recipes (v1 stores them only in the current browser's
  `localStorage`).
- Servings-range filtering, sorting controls, full-text/fuzzy ranking, pagination, and server-side filtering.
- Changes to recipe creation, editing, or display pages.

### 1.4 Audience

Contributors and AI agents implementing or modifying the search/filter page and its recent-recipes store.

## 2. Definitions

| Term                  | Definition                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Query**             | The free-text string entered in the search input; matched against recipe name only in v1.                           |
| **Tag**               | A recipe classifier; a member of `RECIPE_TAGS` (user-assigned) or `AUTO_TAGS` (derived: `vegetarian`, `magimix`).   |
| **Active filters**    | The current `{ query, tags }` selection driving the result set.                                                     |
| **No active filters** | The state where the trimmed query is `''` AND no tags are selected (`tags.length === 0`).                           |
| **Normalize**         | Lowercase a string and strip diacritics so `Crème` and `creme` compare equal (see §4.6, `PAT-001`).                 |
| **Reduced recipe**    | The recipe shape returned by `getRecipeListOptions`: `{ id, image, name, servings, tags }` (unchanged in v1).       |
| **Empty state**       | The UI shown when the catalogue is non-empty but the active filters match zero recipes.                             |
| **Match**             | A recipe is a match when it satisfies BOTH the query predicate AND the tag predicate (see §4.5).                    |
| **Recent recipe**     | A recipe the user previously opened from the `/search` results; its id is stored most-recent-first in localStorage. |

## 3. Requirements, Constraints & Guidelines

### 3.1 Functional Requirements

- **REQ-001**: The route `/search` MUST render a search input, a tag filter control, and a content area within the
  standard `ScreenLayout` (`title="Rechercher"`, `pageKey="/search"`). The search input is always visible with a filter
  button beside it; that button toggles a `Collapsible` revealing the category-select chip. The content area swaps
  between recents, filtered results, and the empty state.
- **REQ-002**: The query MUST match a recipe when the normalized query is a substring of the recipe's normalized
  `name`. (Ingredient-name matching is deferred; see §1.3 / §11.)
- **REQ-003**: Text matching MUST be case-insensitive AND accent/diacritic-insensitive in both directions (query and
  candidate are normalized identically before comparison).
- **REQ-004**: An empty query (after trimming) MUST NOT restrict results by text (it matches every recipe).
- **REQ-005**: The tag filter MUST allow selecting zero or more tags from the union of `RECIPE_TAGS` and `AUTO_TAGS`,
  each rendered with its `RECIPE_TAG_LABELS` label, as a multi-select bound to component-local state. The control (the
  collapsible content) is a shared `ResponsiveSelect` in `multiple` mode — a Select popover on desktop and a drawer on
  mobile (`useIsMobile`) — whose trigger always shows the selected values (comma-joined) or the placeholder when empty.
- **REQ-006**: When one or more tags are selected, a recipe MUST match only if its `tags` array contains **every**
  selected tag (AND semantics). When no tag is selected, the tag predicate matches every recipe.
- **REQ-007**: When filters are active, the content area MUST show the recipes satisfying BOTH the query predicate and
  the tag predicate, in the server-provided order (`name` ascending), with no client-side re-sorting.
- **REQ-008**: Each recipe row (filtered results AND recent rows) MUST link to `/recipe/$id` (params
  `{ id: recipe.id.toString() }`) using a router `Link` with `viewTransition`, and MUST record the recipe as recent
  (REQ-013) when activated.
- **REQ-009**: When the catalogue is non-empty but zero recipes match the active filters, the content area MUST render
  an explicit empty state (message) instead of an empty list.
- **REQ-010**: The page MUST expose a "clear all filters" affordance that resets the query to `''` and the selected
  tags to `[]`. It MUST be reachable from the empty state and whenever any filter is active. Clearing returns the page
  to the no-active-filters (recents) state.
- **REQ-011**: The feature MUST live under `src/features/search/` following the feature-module layout in the
  file-structure spec; the route file `src/routes/search.tsx` MUST delegate UI to components in that module.
- **REQ-012**: When there are no active filters, the content area MUST render the **recent recipes** section instead of
  the full catalogue: the recipes referenced by `recentRecipeIds`, resolved against the cached list, in stored order
  (most-recent-first). Stale ids (absent from the cached list) MUST be skipped during rendering.
- **REQ-013**: Activating any recipe row on `/search` MUST record that recipe via
  `useRecentRecipesStore.addRecentRecipe(id)` before/at navigation, so the recipe becomes the most-recent entry.
- **REQ-014**: `addRecentRecipe(id)` MUST keep `recentRecipeIds` most-recent-first, de-duplicated (an existing id is
  moved to the front, not duplicated), and capped at `MAX_RECENT_RECIPES` (10); ids beyond the cap are dropped from the
  tail.
- **REQ-015**: The recent-recipes state MUST be a persisted Zustand store at `src/stores/recent-recipes.store.ts`
  (`useRecentRecipesStore`) holding ids only (`number[]`), following the persisted-store convention in the client-state
  spec (`persist` middleware, explicit `partialize`, no `client-only` directive).
- **REQ-016**: The recents section renders directly (no `<ClientOnly>`): the `/search` route is client-only
  (`defaultSsr: false`), so the store is read only on the client. On empty history (`recentRecipeIds` resolves to zero
  recipes), it MUST fall back to the full catalogue in `name` ascending order so the default view is never empty on
  first use.

### 3.2 Constraints

- **CON-001**: Filtering MUST run entirely client-side over the React Query cache populated by the existing
  `getRecipeListOptions`; no new server function and no projection change are introduced in v1.
- **CON-002**: Filter state (`query`, `tags`) MUST be component-local React state and MUST NOT be encoded in the route
  search params (no URL persistence in v1).
- **CON-003**: `getRecipeListOptions` MUST remain unchanged (same shape `{ id, image, name, servings, tags }` and same
  key `queryKeys.recipeList()`), so the home list, command palette, and recipe-form combobox are unaffected.
- **CON-004**: Normalization MUST use Unicode NFD decomposition + combining-mark stripping (no external i18n
  dependency) so it runs identically on the Workers runtime and the browser.
- **CON-005**: All new files MUST be kebab-case TypeScript (`.ts` for non-JSX, `.tsx` for JSX) per repo lint rules.
- **CON-006**: Recent recipes MUST persist ids only (never full recipe snapshots); the display always resolves ids
  against the live `getRecipeListOptions` cache so renamed/edited recipes show current data and deleted recipes vanish.
- **CON-007**: The recent-recipes store is browser-local (`localStorage`) and is read only on the client because the
  `/search` route is client-only (`defaultSsr: false`); no `<ClientOnly>` is needed (matches the client-state spec).

### 3.3 Guidelines

- **GUD-001**: Derive the tag toggle items from `RECIPE_TAGS`/`AUTO_TAGS` + `RECIPE_TAG_LABELS`; do not hardcode tag
  lists in the search components.
- **GUD-002**: Build the category control by reusing existing primitives: `Collapsible` (`@/components/ui/collapsible`)
  for the reveal and the shared `Select` (`@/components/ui/select`) in `multiple` mode for the
  multi-select itself (Select popover on desktop, drawer on mobile). Reuse `SearchInput`, `ScreenLayout`, and
  `Item`/`ItemGroup` for the rest. Do not use form-bound wrappers (`ToggleGroupField`).
- **GUD-003**: Keep the pure matching/normalization logic in `src/features/search/utils/` so it is unit-testable
  without React or the DB.
- **GUD-004**: Memoize the filtered result derivation (`useMemo`) keyed on `[recipes, query, tags]` to avoid
  recomputing on unrelated renders.
- **GUD-005**: Mirror the existing `useShoppingListStore` shape and the id→recipe resolution pattern (resolve ids
  against the cached list); do not invent a new persistence mechanism.

### 3.4 Patterns

- **PAT-001**: `normalize(value)` = `value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()`. Apply it to
  both sides of every text comparison; never compare raw strings.
- **PAT-002**: Compose predicates as small pure functions (`matchesQuery`, `matchesTags`) and combine with logical AND
  in a single `filterRecipes(recipes, filters)` entry point.

## 4. Interfaces & Data Contracts

### 4.1 Route

```ts
// src/routes/search.tsx
export const Route = createFileRoute('/search')({
  component: SearchPage, // delegates to src/features/search/components
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRecipeListOptions())
  },
})
```

### 4.2 Reduced-recipe shape (unchanged in v1)

```ts
interface ReducedRecipe {
  id: number
  image: string // resolved via getImageUrl
  name: string
  servings: number
  tags: RecipeTag[]
}
```

> v1 does NOT add `ingredientNames`. Ingredient search and the supporting `with: { ingredientGroups: … }` projection
> are deferred (see §11, "Future versions").

### 4.3 Filter state contract

```ts
interface SearchFilters {
  query: string // raw user input; trimmed+normalized at match time
  tags: RecipeTag[] // selected tags, AND-combined
}

const EMPTY_FILTERS: SearchFilters = { query: '', tags: [] }
const hasActiveFilters = (f: SearchFilters): boolean => f.query.trim() !== '' || f.tags.length > 0
```

### 4.4 Tag filter items

```ts
import { AUTO_TAGS, RECIPE_TAGS, RECIPE_TAG_LABELS } from '@/features/recipe/utils/constants'

const tagFilterItems = [...RECIPE_TAGS, ...AUTO_TAGS].map((tag) => ({
  label: RECIPE_TAG_LABELS[tag],
  value: tag,
}))
```

### 4.5 Matching contract (pure)

```ts
// src/features/search/utils/filter.ts
const matchesQuery = (recipe: ReducedRecipe, query: string): boolean => {
  const q = normalize(query.trim())
  if (q === '') return true
  return normalize(recipe.name).includes(q)
}

const matchesTags = (recipe: ReducedRecipe, tags: RecipeTag[]): boolean => tags.every((tag) => recipe.tags.includes(tag))

const filterRecipes = (recipes: ReducedRecipe[], filters: SearchFilters): ReducedRecipe[] =>
  recipes.filter((r) => matchesQuery(r, filters.query) && matchesTags(r, filters.tags))
```

### 4.6 Normalization contract (pure)

```ts
// src/features/search/utils/normalize.ts
export const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
```

### 4.7 Recent-recipes store (persisted, ids only)

```ts
// src/stores/recent-recipes.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENT_RECIPES = 10

interface RecentRecipesState {
  recentRecipeIds: number[] // most-recent-first, deduped, length ≤ MAX_RECENT_RECIPES
  addRecentRecipe: (recipeId: number) => void
}

export const useRecentRecipesStore = create<RecentRecipesState>()(
  persist(
    (set) => ({
      addRecentRecipe: (recipeId) =>
        set(({ recentRecipeIds }) => ({
          recentRecipeIds: [recipeId, ...recentRecipeIds.filter((id) => id !== recipeId)].slice(0, MAX_RECENT_RECIPES),
        })),
      recentRecipeIds: [],
    }),
    {
      name: 'recent-recipes',
      partialize: (state) => ({ recentRecipeIds: state.recentRecipeIds }),
    }
  )
)
```

### 4.8 Content-area selection & recents resolution

```ts
// Recents branch (client-only route — read store directly):
const recentRecipes = recentRecipeIds
  .map((id) => recipes.find((recipe) => recipe.id === id))
  .filter((recipe): recipe is ReducedRecipe => recipe !== undefined) // skip stale/deleted ids

const content = hasActiveFilters(filters)
  ? filterRecipes(recipes, filters) // → results, or empty state when length === 0 (REQ-009)
  : recentRecipes.length > 0
    ? recentRecipes // recents (REQ-012)
    : recipes // empty-history fallback, name asc (REQ-016)
```

### 4.9 Module layout

```
src/features/search/
  components/
    search-page.tsx           // composes layout, filters, content area
    search-filters.tsx        // search input + filter button revealing the category chip (Collapsible)
    category-select.tsx       // multi-select of categories via shared ResponsiveSelect (popover/drawer)
    search-results.tsx        // filtered results or empty state (clear-all action)
    recent-recipes.tsx        // thin wrapper rendering recent-recipes-content
    recent-recipes-content.tsx// reads store, resolves recents, fallback to catalogue
    recipe-list.tsx           // ItemGroup of per-row Links (records recent on activate)
  utils/
    filter.ts                 // matchesQuery / matchesTags / filterRecipes
    normalize.ts              // normalize()
  search.spec.md              // this file (single-file feature spec, REQ-013 of file-structure spec)

src/stores/
  recent-recipes.store.ts     // useRecentRecipesStore (persisted, ids only) — see §4.7
```

> Client-only rendering: the `/search` route is client-only (`defaultSsr: false`), so modules that read the persisted
> store (`recipe-list.tsx`, `recent-recipes-content.tsx`) run only on the client. No `client-only` directive or
> `<ClientOnly>` boundary is needed — both branches (results and recents) render directly.

> Note: per file-structure REQ-013 this single-file feature spec lives at `src/features/search/search.spec.md`. If the
> feature later grows multiple specs, it MAY move to `src/features/search/spec/index.spec.md` plus sub-specs.

## 5. Acceptance Criteria

- **AC-001**: Given the catalogue contains "Crème brûlée", When the user types `creme`, Then that recipe appears in the
  results (accent + case insensitive name match).
- **AC-002**: Given the user selects the tags `italian` and `vegetarian`, Then only recipes whose `tags` include BOTH
  are shown (AND semantics).
- **AC-003**: Given active filters that match zero recipes while the catalogue is non-empty, Then the page shows the
  empty state with a "clear all filters" action and NOT an empty list.
- **AC-004**: Given any active filter, When the user activates "clear all filters", Then `query` becomes `''`, `tags`
  becomes `[]`, and the page returns to the recents (no-active-filters) state.
- **AC-005**: Given a result or recent row, When the user activates it, Then the app navigates to `/recipe/$id` with a
  view transition AND the recipe is recorded as the most-recent recent.
- **AC-006**: Given no active filters and a non-empty `recentRecipeIds`, Then the page shows the "Recherches récentes"
  section listing those recipes most-recent-first, and NOT the full catalogue.
- **AC-007**: Given no active filters and an empty `recentRecipeIds`, Then the page shows the full catalogue in `name`
  ascending order (empty-history fallback).
- **AC-008**: Given the user opens recipe `B` then recipe `A` from `/search`, Then `recentRecipeIds` starts with
  `[A, B, …]` (most-recent-first, no duplicates).
- **AC-009**: Given recipe `A` is already recent, When the user opens `A` again, Then `A` moves to the front and the
  list length does NOT increase (dedupe).
- **AC-010**: Given 10 recent recipes are stored, When the user opens an 11th, Then the list keeps 10 entries and the
  oldest is dropped (cap = `MAX_RECENT_RECIPES`).
- **AC-011**: Given a `recentRecipeIds` entry whose recipe was deleted (absent from the cached list), When the recent
  section renders, Then that id is skipped and no broken row is shown.
- **AC-012**: Given the page is requested, Then the worker returns the root shell with an empty `<main>` (the `/search`
  route is client-only); the recents section renders on the client with no hydration mismatch, and `recentRecipeIds` is
  restored from `localStorage`.
- **AC-013**: Given the same data, When `getRecipeListOptions` is queried, Then its shape and key
  (`queryKeys.recipeList()`) are unchanged, so the home list, command palette, and recipe-form combobox behave
  identically.

## 6. Test Automation Strategy

- **Test Levels**: Unit (pure utils + store action), Component (search page rendering/interaction).
- **Frameworks**: Vitest (run via `vp test`); React Testing Library for component tests.
- **Test Data Management**: In-memory `ReducedRecipe[]` fixtures; reset `localStorage`/store between tests.
- **CI/CD Integration**: `vp check` (fmt + lint + types) and `vp test` run in the project pipeline; both MUST pass.
- **Coverage Requirements**: `normalize`, `matchesQuery`, `matchesTags`, and `filterRecipes` MUST each have unit tests
  (empty query, accent/case variants, multi-tag AND, no-match). `addRecentRecipe` MUST have unit tests covering
  prepend order, dedupe/move-to-front, and cap enforcement.
- **Performance Testing**: Not required; filtering is O(recipes) over an already-cached list.

## 7. Rationale & Context

- **7.1 Why client-side filtering** — The reduced recipe list is already fetched and cached (`getRecipeListOptions`);
  filtering in the browser gives instant feedback with zero extra round-trips and keeps the feature offline-capable
  (the app registers a service worker).
- **7.2 Why ingredient search is deferred** — Ingredient matching requires extending the shared `getRecipeListOptions`
  projection (a nested `with` traversal) which grows the payload for every consumer. v1 keeps the query untouched and
  ships name + tags; ingredient search is a contained later increment (see §11).
- **7.3 Why normalize via NFD** — Diacritic stripping with `\p{Diacritic}` needs no i18n library, behaves identically
  on the Workers runtime and the browser, and matches expectations for French names (`crème`, `pâte`).
- **7.4 Why AND semantics for tags** — Selecting more tags expresses a narrower intent and yields predictable,
  shrinking result sets — the conventional behaviour for refinement filters.
- **7.5 Why recents replace the catalogue (with fallback)** — The full catalogue already is the home page (`/`);
  repeating it on `/search` duplicates home and buries the recents. A focused "jump back in" list gives `/search` a
  distinct purpose, while the full-list fallback keeps first-time users (no history) from seeing an empty page.
- **7.6 Why store recent ids, not snapshots** — Ids resolved against the live query cache keep recent rows in sync with
  edits/renames and let deleted recipes drop out automatically; it mirrors `useShoppingListStore`.
- **7.7 Why `localStorage` and `/search`-only recording for v1** — Recent recipes are a low-stakes per-device
  convenience; `localStorage` via Zustand `persist` needs no schema, migration, or auth. Recording only from `/search`
  keeps the feature self-contained (no edits into the command palette); both are easy future extensions.
- **7.8 Why client-only rendering** — The store reads `localStorage`, unavailable at SSR. Client-only render mode
  (`defaultSsr: false`) means the `/search` route never renders server-side, so the store is read directly on the
  client with no hydration mismatch and no `<ClientOnly>` boundary.

## 8. Dependencies & External Integrations

### External Systems

- **EXT-001**: Cloudflare D1 (SQLite) — source of the recipe rows already projected by `getRecipeListOptions`.

### Data Dependencies

- **DAT-001**: `getRecipeListOptions` / `ReducedRecipe` from `src/features/recipe/api/get-all.ts` (consumed as-is).
- **DAT-002**: `RECIPE_TAGS`, `AUTO_TAGS`, `RECIPE_TAG_LABELS` from `src/features/recipe/utils/constants.ts`.

### Technology Platform Dependencies

- **PLT-001**: TanStack Start/Router (route, loader, `Link`; client-only render via `createStart`'s `defaultSsr: false`)
  and TanStack React Query (`getRecipeListOptions`, `ensureQueryData`).
- **PLT-002**: ECMAScript `String.prototype.normalize('NFD')` and Unicode property escapes (`\p{Diacritic}`), available
  in the Workers runtime and target browsers.
- **PLT-003**: Zustand + `zustand/middleware` `persist` over the browser `localStorage` API (recent-recipes store).
  The store is read only on the client because `/search` is a client-only route.

### Compliance Dependencies

- **COM-001**: None.

## 9. Examples & Edge Cases

```ts
const recipes: ReducedRecipe[] = [
  { id: 1, name: 'Crème brûlée', tags: ['dessert', 'french'], servings: 4, image: '' },
  { id: 2, name: 'Pesto pasta', tags: ['italian', 'vegetarian'], servings: 2, image: '' },
  { id: 3, name: 'Steak frites', tags: ['french'], servings: 2, image: '' },
]

filterRecipes(recipes, { query: 'creme', tags: [] }) // → [recipe 1] (accent-insensitive name match)
filterRecipes(recipes, { query: '', tags: ['vegetarian'] }) // → [recipe 2]
filterRecipes(recipes, { query: '', tags: ['italian', 'vegetarian'] }) // → [recipe 2] (AND)
filterRecipes(recipes, { query: '', tags: ['italian', 'dessert'] }) // → []  → render empty state
filterRecipes(recipes, { query: '   ', tags: [] }) // → all (whitespace query ignored)
```

Recent-recipes behaviour (`addRecentRecipe`, from `recentRecipeIds: []`, `MAX_RECENT_RECIPES = 10`):

```ts
addRecentRecipe(2) // → [2]
addRecentRecipe(1) // → [1, 2]        (most-recent-first)
addRecentRecipe(2) // → [2, 1]        (dedupe: 2 moved to front, length unchanged)
// pushing ids until 10 are stored, then one more:
addRecentRecipe(12) // → [12, …]      (length stays 10, oldest tail id dropped)

// No active filters, recentRecipeIds = [2, 99, 1], recipe 99 deleted → recents = [recipe 2, recipe 1] (99 skipped)
// No active filters, recentRecipeIds = []                          → full catalogue, name asc (fallback)
```

Edge cases:

- **Empty catalogue**: When `recipes.length === 0`, show the standard "no recipes yet" content, NOT the filter empty
  state (the empty state is specifically for "filters matched nothing").
- **All recent ids stale**: every `recentRecipeIds` entry is absent from the cache → recents resolve to `[]` → fall
  back to the full catalogue, do NOT show an empty recent section.
- **Recent then filter**: as soon as a filter becomes active the recents section is replaced by filtered results;
  clearing filters restores the recents section.
- **`AUTO_TAGS` selected but absent on every recipe**: yields zero matches → empty state.

## 10. Validation Criteria

- **VAL-001**: `vp check` (format + lint + type-check) passes for all new/changed files.
- **VAL-002**: `vp test` passes, including the unit tests mandated in §6.
- **VAL-003**: This spec parses against the front-matter and eleven-section schema in `docs/file-structure.spec.md` §4.
- **VAL-004**: `getRecipeListOptions` and `ReducedRecipe` are byte-for-byte unchanged by this feature (no projection or
  key churn); existing consumers compile and behave identically.
- **VAL-005**: `src/stores/recent-recipes.store.ts` is a plain module (no `client-only` directive) using the `persist`
  middleware with `name: 'recent-recipes'` and an explicit `partialize` exposing only `recentRecipeIds`; consumers
  render directly within the client-only `/search` route (no `<ClientOnly>`).
- **VAL-006**: Manual check — typing an accented vs unaccented query yields identical results; multiple tags narrow
  results; clearing filters returns to recents; a zero-match filter shows the empty state; opening recipes from
  `/search` populates "Recherches récentes" most-recent-first; re-opening reorders without duplicating; the list never
  exceeds 10; deleted recipes disappear from the section; a fresh browser shows the full catalogue.

## 11. Related Specifications / Further Reading

- [Recipe Feature Spec](../recipe/spec/index.spec.md)
- [Recipe Display Spec](../recipe/spec/display.spec.md) — recipe list query & route data
- [Data Layer (Drizzle + D1)](../../../docs/infrastructure/data-layer.spec.md) — relational `with` projection (for the
  deferred ingredient-search increment)
- [Server Functions](../../../docs/infrastructure/server-functions.spec.md)
- [Client State Layering](../../../docs/infrastructure/client-state.spec.md) — persisted store + client-only render rules
- [Routing & SSR](../../../docs/infrastructure/routing-ssr.spec.md)
- [Project File Structure Spec](../../../docs/file-structure.spec.md) — §4 spec template

### Future versions (deferred)

- **Ingredient-name search**: extend `getRecipeListOptions` with a `with: { ingredientGroups: { groupIngredients:
{ ingredient } } }` projection to add `ingredientNames: string[]`, then OR it into `matchesQuery`.
- **Command-palette integration**: record recents from `SearchBar` and show recents on its empty input.
- **Clear-history affordance** and **URL-persisted filters**.
