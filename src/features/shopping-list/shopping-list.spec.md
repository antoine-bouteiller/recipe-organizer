---
title: Shopping List
status: amended
author: Antoine Bouteiller
date: 2026-08-14
related: [docs/architecture.spec.md]
---

## 2. Problem Statement

Home cooks need one purchase list for several recipes, even when each recipe uses different servings,
units, linked recipes, or ingredient variants. The shopping list preserves the cook's local recipe
selection and serving intent, then derives a category-grouped list from an authoritative recipe
projection. This fulfils architecture [G-4] and refines its client-state boundary [KD-7].

- `[G-1]` Produce a complete, scaled shopping list from a device-local selection of recipes.
- `[G-2]` Aggregate compatible ingredient quantities without hiding quantities that cannot convert.
- `[G-3]` Keep purchase-list interaction fast and durable without persisting recipe records in browser storage.

## 3. Key Design Decisions

| Decision                      | Choice                                                                                                             | Rationale                                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `[KD-1]` Durable intent       | Two persisted stores hold selected recipe IDs and serving overrides separately.                                    | Selection and quantity intent have independent lifetimes: removing a recipe does not discard its chosen serving count.                     |
| `[KD-2]` Recipe projection    | A GET server function returns selected recipes with direct and linked ingredient lines.                            | The Worker supplies relationally consistent source data while the browser retains the user-specific serving choice.                        |
| `[KD-3]` Aggregation location | The browser scales, converts, rolls up, and groups the projection in a pure derivation.                            | Serving overrides live on the device, and a pure computation makes each rendered list correspond directly to its selection and quantities. |
| `[KD-4]` Unit result          | Each ingredient has one preferred primary unit plus residual fallback lines.                                       | Conversion failures remain visible to the shopper instead of being silently dropped or inaccurately summed.                                |
| `[KD-5]` Ingredient hierarchy | Child ingredients disappear from the displayed list and contribute their largest primary quantity to their parent. | A parent purchase can satisfy a child variant, while selecting the largest child quantity avoids double-counting variants.                 |

## 4. Principles & Intents

- `[PI-1]` **Persist intent, query records** — refine architecture [PI-4]; stores hold recipe IDs and
  serving values, while an API response supplies recipe data.
- `[PI-2]` **No lost quantity** — an incompatible or unitless conversion remains a separately labelled
  fallback amount.
- `[PI-3]` **Server projection, client presentation** — the feature API owns relational traversal and
  the hook owns deterministic purchase-list derivation.
- `[PI-4]` **Categories remain semantic** — the ingredient category selects both grouping and its
  French display label and icon.

## 5. Non-Goals

- `[NG-1]` Per-user server persistence, sharing, or synchronization of a shopping list.
- `[NG-2]` Editing recipes or ingredients from the shopping-list screen.
- `[NG-3]` Durable completion state for individual purchase items.
- `[NG-4]` Shopping-list entries for ingredients in the `spices` category.
- `[NG-5]` Inventing a conversion where ingredient density or count weight does not support one.

## 6. Caveats

- `[C-1]` Each distinct selected-ID array retains one request promise per document, with no TTL or mutation invalidation; failed promises are evicted, refining architecture [C-5].
- `[C-2]` A missing selected recipe produces no projection row and therefore no shopping-list lines.
- `[C-3]` `convert` returns `null` for incompatible dimensions or absent conversion metadata; those
  amounts remain fallback lines (`src/features/shopping-list/client/utils/aggregate-shopping-list.ts`).
- `[C-4]` A child ingredient contributes only its greatest primary amount among siblings, not a sum
  (`src/features/shopping-list/client/utils/aggregate-shopping-list.ts`).
- `[C-5]` Checkmarks are component-local state and reset when their `CartItem` unmounts
  (`src/features/shopping-list/client/component/cart-item.svelte`).

## 7. High-Level Components

```text
persisted recipe IDs ─┐
                       ├─> stable request promise ─> recipe projection ─┐
persisted servings ───┘                                         │
                                                                  v
                                                         aggregateShoppingList
                                                         scale → convert → roll up → group
                                                                  │
                                                                  v
                                                       category sections and cart items
```

| Component          | Module type                       | Responsibility                                           | Public API surface                                 |
| ------------------ | --------------------------------- | -------------------------------------------------------- | -------------------------------------------------- |
| Selection store    | Persisted TanStack Store          | Preserve selected recipe identifiers                     | `useShoppingListIds`, add, remove, reset           |
| Quantity store     | Persisted TanStack Store          | Preserve per-recipe serving overrides                    | `useRecipeQuantitiesState`, `setRecipesQuantities` |
| Recipe projection  | Feature GET API                   | Read selected recipes and flattened linked-recipe lines  | `loadRecipesByIds(ids)`                            |
| Aggregator         | Pure feature utility              | Scale, aggregate, convert, roll up, and categorize lines | `aggregateShoppingList()`                          |
| Shopping-list hook | Feature hook                      | Join stores, API projection, and derived output          | `useShoppingList()`                                |
| List screen        | Void hydrated page and components | Render loading, empty, grouped, and checked-item states  | `/shopping-list`, `ShoppingList`, `CartItem`       |

## 8. Detailed Design

### 8.1 Durable selection and serving intent

`shopping-list` holds `number[]` recipe identifiers; `recipe-quantities` holds
`Record<number, number>` overrides. Both are data-only persisted stores with hydration-safe read hooks and
exported mutation functions (`src/stores/shopping-list.store.svelte.ts`,
`src/stores/recipe-quantities.store.svelte.ts`). A serving override defaults to the recipe's declared
`servings` only when its map entry is nullish. This refines the client-state specification's
[persisted selection contract](../../../docs/infrastructure/client/client-state.spec.md).

### 8.2 Projection contract

`loadRecipesByIds(ids)` calls typed `GET /api/shopping-list/recipes` with a JSON-stringified
`ids` query value. A map retains one stable promise per distinct ID array;
failed promises are removed (`src/features/shopping-list/client/api/get-recipe-by-ids.ts`).
The hook makes no request for an empty selection. This is not a timed query cache.

| Field                          | Meaning                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| `RecipeForCart.id`, `servings` | Identity and baseline serving count                                  |
| `ingredients[]`                | Direct lines followed by linked-recipe lines                         |
| Ingredient metadata            | ID, category, name, parent ID, preferred unit, density, count weight |
| Quantity and unit              | Amount at the recipe baseline                                        |

The API handler traverses direct and linked ingredient groups. Linked lines use
`quantity × ratio ÷ linkedRecipe.servings` (`routes/api/shopping-list/recipes.ts`).
The shared database projection excludes `spices`
(`src/features/shopping-list/server/ingredient-group-select.ts`).

### 8.3 Aggregation contract

For each recipe, the aggregator calculates `line.quantity × wantedServings ÷ recipe.servings`,
then accumulates raw lines by ingredient ID (`src/features/shopping-list/client/utils/aggregate-shopping-list.ts`).
The accumulator chooses `preferredUnitSlug`, or its first line's unit, as the primary target. Lines
with that unit or a successful conversion add to the primary total; every other line totals under its
original unit in `fallback`.

```text
for each selected recipe and ingredient line
  scale line by wanted servings / recipe servings
  collect line under ingredient ID
for each ingredient
  convert each line to its preferred (or first) unit
  retain failed conversions as fallback amounts
remove children and add each parent's greatest child primary amount
place surviving ingredients under their category
```

The resulting item shape is `{ id, name, category, primary, fallback }`, where `primary` and every
fallback entry contain `quantity` and `unitSlug`
(`src/features/shopping-list/client/types/ingredient-cart-item.ts`).

### 8.4 List interaction

`pages/shopping-list/index.svelte` directly composes ScreenLayout, current-path TabBar,
ShoppingList, and an inline reset button. It has no server companion: regular pages are not
auto-prerendered, and device-local selected recipes cannot be loaded on the server.

`useShoppingList()` uses `useIsHydrated()`: SSR, hydration, and recipe loading stay in an explicit `pending`
state that ShoppingList renders as neutral skeleton sections. After mount the hook reads the persisted
ID/quantity stores, calls `loadRecipesByIds(ids)` for a nonempty selection, and aggregates the projection
on `success`; `error` shows a French retry alert whose button reruns the load. Empty groups render the
French empty-list message; otherwise category headings and CartItems render
(`src/features/shopping-list/client/component/shopping-list.svelte`).

CartItem formats primary/fallback values, retains incompatible amounts visibly, and keeps checked
state local to the mounted row. Reset clears only selected recipe IDs; serving overrides remain
available later (`pages/shopping-list/index.svelte`).

The list is derived from selection, quantity intent, and API records. No records or aggregates are
persisted, but fulfilled request promises remain document-local snapshots until document reload.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                                                          | Sections affected | Reason                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | ----------------- | ------------------------------------------- |
| 2026-09-13 | Update the projection citation to `src/server/routes/`.                                                            | 8.2               | Match the server route layout.              |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries.                             | Updated contracts | Reflect the completed page migration.       |
| 2026-10-03 | Document regular page composition and inline reset without a server companion.                                     | 7, 8.4            | Match hydrated local-only browsing.         |
| 2026-10-04 | Replace React `use()`/Suspense loading with explicit pending/success/error state in the Svelte shopping-list hook. | 8.2, 8.4          | Match the shipped Svelte state conventions. |
