---
title: Shopping List
status: implemented
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
  serving values, while TanStack Query owns recipe data.
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

- `[C-1]` The query key contains the selected ID array, so each distinct compact selection has a
  separate cache entry, refining architecture [C-5].
- `[C-2]` A missing selected recipe produces no projection row and therefore no shopping-list lines.
- `[C-3]` `convert` returns `null` for incompatible dimensions or absent conversion metadata; those
  amounts remain fallback lines (`src/features/shopping-list/utils/aggregate-shopping-list.ts:38-49`).
- `[C-4]` A child ingredient contributes only its greatest primary amount among siblings, not a sum
  (`src/features/shopping-list/utils/aggregate-shopping-list.ts:101-120`).
- `[C-5]` Checkmarks are component-local state and reset when their `CartItem` unmounts
  (`src/features/shopping-list/component/cart-item.tsx:17-39`).

## 7. High-Level Components

```text
persisted recipe IDs ─┐
                       ├─> query options ─> recipe projection ─┐
persisted servings ───┘                                         │
                                                                  v
                                                         aggregateShoppingList
                                                         scale → convert → roll up → group
                                                                  │
                                                                  v
                                                       category sections and cart items
```

| Component          | Module type              | Responsibility                                           | Public API surface                                 |
| ------------------ | ------------------------ | -------------------------------------------------------- | -------------------------------------------------- |
| Selection store    | Persisted TanStack Store | Preserve selected recipe identifiers                     | `useShoppingListIds`, add, remove, reset           |
| Quantity store     | Persisted TanStack Store | Preserve per-recipe serving overrides                    | `useRecipeQuantitiesState`, `setRecipesQuantities` |
| Recipe projection  | Feature GET API          | Read selected recipes and flattened linked-recipe lines  | `getRecipeByIdsOptions(ids)`                       |
| Aggregator         | Pure feature utility     | Scale, aggregate, convert, roll up, and categorize lines | `aggregateShoppingList()`                          |
| Shopping-list hook | Feature hook             | Join stores, query result, and derived output            | `useShoppingList()`                                |
| List screen        | Route and components     | Render loading, empty, grouped, and checked-item states  | `/shopping-list`, `ShoppingList`, `CartItem`       |

## 8. Detailed Design

### 8.1 Durable selection and serving intent

`shopping-list` holds `number[]` recipe identifiers; `recipe-quantities` holds
`Record<number, number>` overrides. Both are data-only persisted stores with selector hooks and
exported mutation functions (`src/stores/shopping-list.store.ts:1-12`,
`src/stores/recipe-quantities.store.ts:1-10`). A serving override defaults to the recipe's declared
`servings` only when its map entry is nullish. This refines the client-state specification's
[persisted selection contract](../../../docs/infrastructure/client/client-state.spec.md).

### 8.2 Projection contract

`getRecipeByIdsOptions(ids)` addresses `queryKeys.recipeListByIds(ids)` and disables its read for
an empty selection (`src/features/shopping-list/api/get-recipe-by-ids.ts:75-81`). Its server function
returns this serializable shape:

| Field                          | Meaning                                                                    |
| ------------------------------ | -------------------------------------------------------------------------- |
| `RecipeForCart.id`, `servings` | Recipe identity and baseline serving count                                 |
| `ingredients[]`                | Direct ingredient lines followed by linked-recipe lines                    |
| ingredient metadata            | `id`, category, name, parent ID, preferred unit, density, and count weight |
| ingredient quantity and unit   | Amount at the recipe's baseline serving scale                              |

Linked-recipe lines use `line.quantity × ratio ÷ linkedRecipe.servings`
(`src/features/shopping-list/api/get-recipe-by-ids.ts:55-70`). The shared ingredient-group projection
excludes `spices` in the database read (`src/features/shopping-list/utils/ingredient-group-select.ts:14-31`).

### 8.3 Aggregation contract

For each recipe, the aggregator calculates `line.quantity × wantedServings ÷ recipe.servings`,
then accumulates raw lines by ingredient ID (`src/features/shopping-list/utils/aggregate-shopping-list.ts:68-99`).
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
(`src/features/shopping-list/types/ingredient-cart-item.ts:5-20`).

### 8.4 List interaction

The `/shopping-list` route supplies the screen layout and reset control
(`src/routes/shopping-list.tsx:8-16`). `ShoppingList` renders skeleton sections while the query is
loading, an empty French message for no groups, then a category heading and item list per category
(`src/features/shopping-list/component/shopping-list.tsx:11-56`). `CartItem` formats primary and
fallback values with the unit schema, applies a local checked style, and leaves fallback values
visible (`src/features/shopping-list/component/cart-item.tsx:10-39`). Reset clears only the selected
recipe IDs; serving overrides remain available for a later selection
(`src/features/shopping-list/component/reset-cart-button.tsx:6-10`).

The screen derives its content from selection, serving intent, and the query response on each render.
It retains no separate persisted copy of recipe or aggregate data, so reset and query invalidation
always converge on their respective owners.

## 9. Open Questions

N/A
