---
title: Shopping List Feature Specification
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [feature, shopping-list, aggregation, units]
---

# Introduction

This specification defines the **shopping-list** feature of the Recipe Organizer app. The feature lets a user
collect a set of recipes, override their target servings, and produce a unified, aggregated, category-grouped
list of ingredients to buy. The list is computed entirely client-side from a server snapshot of the selected
recipes, with quantity scaling, unit conversion, parent/child rollup, and graceful fallback when units are
incompatible. Selection state is persisted in `localStorage` via Zustand `persist`. The page is rendered
client-only because all of its inputs come from persisted client state.

## 1. Purpose & Scope

### 1.1 Purpose

Provide a deterministic, client-rendered shopping list that:

- Tracks which recipes the user wants to cook (`shoppingList: number[]`).
- Tracks the user's desired servings per recipe (`recipesQuantities: Record<number, number>`).
- Pulls those recipes (with linked sub-recipes) from the server.
- Scales each ingredient line by the user's wanted servings.
- Aggregates identical ingredients across recipes, converting units when possible.
- Rolls child ingredients up into their parent.
- Groups the final list by ingredient category.

### 1.2 In Scope

- Client persistence of recipe selection and per-recipe servings overrides.
- Server-side projection of recipes + ingredient groups + linked recipes (no auth).
- Unit-aware aggregation, conversion, and fallback handling.
- Rendering and interactive checkbox UX of the list at `/shopping-list`.
- Reset of selection via `ResetCartButton`.

### 1.3 Out of Scope

- Persistence of which items have been "checked" in the UI (purely local component state).
- Per-user server persistence of the shopping list.
- Editing ingredients from the shopping list page.
- Spices (excluded server-side from `groupIngredients`).
- Any unit dimension other than `mass | volume | count | length` as defined by `UNITS`.

## 2. Definitions

| Term                        | Definition                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- | ------------------------------------------------------------------------------------------------------------------ |
| **Recipe**                  | A row in the `recipe` table with a `servings` integer column.                                                                                                              |
| **IngredientGroup**         | A logical grouping (`recipeIngredientGroup`) of ingredient lines for a recipe.                                                                                             |
| **GroupIngredient**         | A row joining a `recipeIngredientGroup` to an `ingredient` with `quantity` + `unitSlug`.                                                                                   |
| **LinkedRecipe**            | A reference from one recipe to another with a `ratio`. The linked recipe's ingredients are flattened into the parent recipe and scaled by `ratio / linkedRecipe.servings`. |
| **Spice**                   | Any ingredient with `category === 'spices'`. Excluded from the shopping list at the SQL layer.                                                                             |
| **Wanted Quantity**         | The user's chosen target servings for a recipe: `recipesQuantities[id] ?? recipe.servings`.                                                                                |
| **Scaled Quantity**         | A line's quantity multiplied by `wantedQuantity / recipe.servings`.                                                                                                        |
| **Primary Quantity**        | The aggregated quantity in the ingredient's preferred unit (the "main" line shown in the cart).                                                                            |
| **Fallback Line**           | A residual quantity in a unit that could not be converted to the primary unit, shown muted under the primary.                                                              |
| **Parent/Child Ingredient** | An ingredient with a non-null `parentId`. Children are removed from the final list and their primary quantity is rolled into the parent via `Math.max`.                    |
| **IngredientCategory**      | The enum used to group items in the cart. Drives the `<h2>` icon + label per group.                                                                                        |
| **UnitSlug**                | One of: `g`, `kg`, `ml`, `l`, `tbsp`, `tsp`, `piece`, `pinch`, `cube`, `bottle`, `sheet`, `box`, `can`, `handful`, `packet`, `cm`.                                         |
| **Dimension**               | One of `mass                                                                                                                                                               | volume | count | length`. Conversion across dimensions requires `densityGPerMl`(volume <-> mass) or`countWeightG` (count <-> mass). |
| **ClientOnly**              | TanStack Start render boundary used to skip a subtree during SSR.                                                                                                          |

## 3. Requirements, Constraints & Guidelines

### 3.1 Functional Requirements

- **REQ-001**: The selection of recipes MUST be stored in a Zustand store named `shoppingList` (key `shopping-list` in `localStorage`) as `shoppingList: number[]`.
- **REQ-002**: Per-recipe servings overrides MUST be stored in a Zustand store named `recipe-quantities` as `recipesQuantities: Record<number, number>`.
- **REQ-003**: Both stores MUST use `zustand/middleware`'s `persist` with `partialize` exposing only `shoppingList` and `recipesQuantities` respectively.
- **REQ-004**: Both store modules MUST import `'@tanstack/react-start/client-only'` so they never load during SSR.
- **REQ-005**: `addToShoppingList(recipeId)` MUST append to `shoppingList`. `removeFromShoppingList(recipeId)` MUST filter by id. `resetShoppingList()` MUST set `shoppingList` to `[]`.
- **REQ-006**: `setRecipesQuantities(recipeId, quantity)` MUST upsert the value at `recipesQuantities[recipeId]`.
- **REQ-007**: A server function `getRecipesByIds` MUST exist (`createServerFn({ method: 'GET' })`) accepting `{ ids: number[] }` validated by Zod (`z.object({ ids: z.array(z.number()) })`). It MUST NOT require authentication.
- **REQ-008**: `getRecipesByIds` MUST query `recipe.findMany` with the recipe's `ingredientGroups` AND `linkedRecipes.linkedRecipe.ingredientGroups`, both via the shared `ingredientGroupSelect`.
- **REQ-009**: `ingredientGroupSelect` MUST exclude ingredients where `ingredient.category === 'spices'` via `where: { ingredient: { category: { NOT: 'spices' } } }`.
- **REQ-010**: For each linked recipe, every ingredient quantity MUST be transformed to `(groupIngredient.quantity * ratio) / linkedRecipe.servings` before being merged into the parent recipe's flattened ingredient list.
- **REQ-011**: The TanStack Query options factory `getRecipeByIdsOptions(ids)` MUST use `queryKeys.recipeListByIds(ids)` (the array of ids is part of the cache key).
- **REQ-012**: `useShoppingList` MUST consume the query via `useSuspenseQuery`.
- **REQ-013**: For every selected recipe, `wantedQuantity` MUST be computed as `isNullOrUndefined(recipesQuantities[recipe.id]) ? recipe.servings : recipesQuantities[recipe.id]`.
- **REQ-014**: Each ingredient line MUST be scaled by `(line.quantity * wantedQuantity) / recipe.servings` before aggregation.
- **REQ-015**: Lines sharing the same `ingredient.id` MUST be aggregated into a single `IngredientAccumulator` keyed by ingredient id; each scaled line is appended to `lines: RawLine[]`.
- **REQ-016**: Aggregation MUST pick a `targetSlug = ingredient.preferredUnitSlug ?? lines[0]?.unitSlug ?? null`.
- **REQ-017**: For each line, the system MUST attempt `tryConvert(line, targetSlug, ingredient)` using `convert(...)` from `src/utils/unit-converter.ts`, supplying `countWeightG` and `densityGPerMl`.
- **REQ-018**: If `tryConvert` returns `null`, the line MUST be added to a `fallbackMap` keyed by its original `unitSlug`. Otherwise the converted value MUST be added to `primaryQuantity`.
- **REQ-019**: After aggregation, child ingredients (`parentId !== null`) MUST be excluded from the final list, and the parent's `primary.quantity` MUST be increased by `Math.max(currentMax, childPrimary)` across all of that parent's children (i.e. parent receives the largest single child's primary quantity, not their sum).
- **REQ-020**: The final list MUST be reduced to `Partial<Record<IngredientCategory, IngredientCartItem[]>>` keyed by `ingredient.category`.
- **REQ-021**: The route file `src/routes/shopping-list.tsx` MUST wrap `<ShoppingList />` in `<ClientOnly fallback={<ShoppingListPending />}>` AND `<Suspense fallback={<ShoppingListPending />}>`. The `<ResetCartButton />` MUST also be inside a `<ClientOnly>`.
- **REQ-022**: `<ShoppingList />` MUST iterate categories with `typedEntriesOf(shoppingListIngredients)`, render `ingredientCategoryIcons[key]` and `ingredientCategoryLabels[key]` inside an `<h2>`, and render one `<CartItem />` per ingredient.
- **REQ-023**: `<CartItem />` MUST render a `<Checkbox>` controlled by local component state, apply `line-through` styling when checked, render the primary quantity + unit on the first line, and render each fallback entry on its own muted line prefixed with `+ `.
- **REQ-024**: Quantity formatting MUST use `formatNumber` from `@/utils/number` and unit display MUST use `UNITS[slug].name`. A `null` `unitSlug` MUST render only the quantity (no unit label).
- **REQ-025**: `<ResetCartButton />` MUST call `useShoppingListStore((store) => store.resetShoppingList)` and clear the shopping list when clicked.

### 3.2 Constraints

- **CON-001**: Both stores are client-only; reading them during SSR is forbidden by the `'@tanstack/react-start/client-only'` import directive.
- **CON-002**: The shopping-list cache key embeds the full ids array. Adding/removing a recipe creates a new cache entry; consumers MUST be aware of cache growth implications.
- **CON-003**: `convert(...)` may return `null` when no conversion path exists (e.g. count -> mass with no `countWeightG`, volume -> mass with no `densityGPerMl`, or two unrelated dimensionless count units). Fallback handling is the only acceptable behavior; the system MUST NOT throw.
- **CON-004**: `tryConvert` short-circuits to `null` when either side is a `null` unit. A line with `unitSlug === null` is only considered convertible when the target is also `null` (in which case quantities sum directly).
- **CON-005**: Aggregation runs synchronously on every render of `useShoppingList`. The function MUST remain pure and side-effect free.
- **CON-006**: Spices MUST never appear in the shopping list; this is enforced at the SQL layer, not the client.
- **CON-007**: The server function does not paginate or limit results. Consumers MUST keep `ids.length` reasonable (typical user shopping list size).
- **CON-008**: Parent rollup uses `Math.max` (not sum). Adding multiple children of the same parent does NOT add their quantities together; only the largest single-child primary is added to the parent.

### 3.3 Guidelines

- **GUD-001**: Prefer driving "wanted servings" widgets (in recipe detail / card components) through `useRecipeQuantitiesStore` rather than local component state so the override survives navigation.
- **GUD-002**: Adding new aggregation steps SHOULD operate on the `IngredientAccumulator` map before `aggregateLines`, or on the post-aggregation `aggregatesById` map, never inline in JSX.
- **GUD-003**: When adding a new `IngredientCategory`, extend `ingredientCategoryIcons` and `ingredientCategoryLabels` so the `<ShoppingList />` renders correctly.
- **GUD-004**: When introducing a new unit, define `parent` + `factor` in `UNITS` (or leave both `null` for an isolated count unit). Cross-dimension conversion still requires `densityGPerMl` or `countWeightG` on the ingredient.
- **GUD-005**: Keep `getRecipesByIds` projection lean; only add columns that are actually consumed by `useShoppingList`.

### 3.4 Patterns

- **PAT-001**: Two-store separation — selection (`shoppingList`) and per-recipe servings (`recipesQuantities`) are two independent stores so quantity overrides survive removing/re-adding a recipe.
- **PAT-002**: Server projects, client aggregates — the server returns flat per-recipe ingredient arrays; the client owns scaling, conversion, rollup, and grouping.
- **PAT-003**: Suspense + ClientOnly composition — the page reads from persisted state that doesn't exist on the server, so the subtree is double-wrapped: `ClientOnly` skips SSR, `Suspense` defers the suspended query.
- **PAT-004**: Primary + fallback aggregation — every aggregated ingredient has exactly one `primary` line and zero or more `fallback` lines for unconvertible residuals.

## 4. Interfaces & Data Contracts

### 4.1 Zustand Stores

```ts
// src/stores/shopping-list.store.ts
interface ShoppingListState {
  shoppingList: number[]
  addToShoppingList: (recipeId: number) => void
  removeFromShoppingList: (recipeId: number) => void
  resetShoppingList: () => void
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      addToShoppingList: (recipeId) => set(({ shoppingList }) => ({ shoppingList: [...shoppingList, recipeId] })),
      removeFromShoppingList: (recipeId) => set(({ shoppingList }) => ({ shoppingList: shoppingList.filter((id) => id !== recipeId) })),
      resetShoppingList: () => set({ shoppingList: [] }),
      shoppingList: [],
    }),
    {
      name: 'shopping-list',
      partialize: (state) => ({ shoppingList: state.shoppingList }),
    }
  )
)
```

```ts
// src/stores/recipe-quantities.store.ts
interface RecipeQuantitiesState {
  recipesQuantities: Record<number, number>
  setRecipesQuantities: (recipeId: number, quantity: number) => void
}

export const useRecipeQuantitiesStore = create<RecipeQuantitiesState>()(
  persist(
    (set) => ({
      recipesQuantities: {},
      setRecipesQuantities: (recipeId, quantity) =>
        set(({ recipesQuantities }) => ({
          recipesQuantities: { ...recipesQuantities, [recipeId]: quantity },
        })),
    }),
    {
      name: 'recipe-quantities',
      partialize: (state) => ({ recipesQuantities: state.recipesQuantities }),
    }
  )
)
```

### 4.2 Server Function

```ts
// src/features/shopping-list/api/get-recipe-by-ids.ts
const getRecipesByIdsSchema = z.object({
  ids: z.array(z.number()),
})

const getRecipesByIds = createServerFn({ method: 'GET' })
  .inputValidator(getRecipesByIdsSchema)
  .handler(
    withServerError(async ({ data }) => {
      /* ... */
    })
  )

const getRecipeByIdsOptions = (ids: number[]) =>
  queryOptions({
    queryFn: () => getRecipesByIds({ data: { ids } }),
    queryKey: queryKeys.recipeListByIds(ids),
  })
```

### 4.3 Drizzle Selection

```ts
// src/features/shopping-list/utils/ingredient-group-select.ts
export const ingredientGroupSelect = {
  columns: { groupName: true, id: true },
  orderBy: { isDefault: 'desc' },
  with: {
    groupIngredients: {
      columns: { id: true, quantity: true, unitSlug: true },
      where: { ingredient: { category: { NOT: 'spices' } } },
      with: {
        ingredient: {
          columns: {
            category: true,
            countWeightG: true,
            densityGPerMl: true,
            id: true,
            name: true,
            parentId: true,
            preferredUnitSlug: true,
          },
        },
      },
    },
  },
} satisfies Parameters<ReturnType<typeof getDb>['query']['recipeIngredientGroup']['findMany']>[0]
```

### 4.4 Server Response Shape

```ts
type RecipeForCart = {
  id: number
  servings: number
  ingredients: ReadonlyArray<{
    category: IngredientCategory
    countWeightG: number | null
    densityGPerMl: number | null
    id: number
    name: string
    parentId: number | null
    preferredUnitSlug: UnitSlug | null
    quantity: number // for linked recipes: (quantity * ratio) / linkedRecipe.servings
    unitSlug: UnitSlug | null
  }>
}
```

### 4.5 Aggregated Output

```ts
// src/features/shopping-list/types/ingredient-cart-item.ts
export interface AggregatedIngredient {
  readonly category: IngredientCategory
  readonly id: number
  readonly name: string
  readonly primary: {
    readonly quantity: number
    readonly unitSlug: UnitSlug | null
  }
  readonly fallback: readonly {
    readonly quantity: number
    readonly unitSlug: UnitSlug | null
  }[]
}

export type IngredientCartItem = AggregatedIngredient
```

### 4.6 Hook Contract

```ts
// src/features/shopping-list/hooks/use-shopping-list.ts
export const useShoppingList = (): {
  recipesQuantities: Record<number, number>
  shoppingListIngredients: Partial<Record<IngredientCategory, IngredientCartItem[]>>
}
```

### 4.7 Unit Conversion Contract

```ts
// src/utils/unit-converter.ts
export const convert = (
  quantity: number,
  fromSlug: UnitSlug,
  toSlug: UnitSlug,
  ingredient: { densityGPerMl: number | null; countWeightG: number | null }
): number | null
```

Returns `null` when no conversion path exists (missing density/count weight, mismatched dimensions, infinite quantities, or unknown slugs).

### 4.8 Unit Schema

```ts
// src/lib/db/schema/unit.ts
export type Dimension = 'mass' | 'volume' | 'count' | 'length'
export type UnitSlug =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'tbsp'
  | 'tsp'
  | 'piece'
  | 'pinch'
  | 'cube'
  | 'bottle'
  | 'sheet'
  | 'box'
  | 'can'
  | 'handful'
  | 'packet'
  | 'cm'
```

Conversion-relevant entries (parent/factor):

| Slug                                                                           | Dimension | Parent | Factor |
| ------------------------------------------------------------------------------ | --------- | ------ | ------ |
| `g`                                                                            | mass      | null   | null   |
| `kg`                                                                           | mass      | `g`    | 1000   |
| `ml`                                                                           | volume    | null   | null   |
| `l`                                                                            | volume    | `ml`   | 1000   |
| `tbsp`                                                                         | volume    | `ml`   | 15     |
| `tsp`                                                                          | volume    | `ml`   | 5      |
| `cm`                                                                           | length    | null   | null   |
| `piece`, `pinch`, `cube`, `bottle`, `sheet`, `box`, `can`, `handful`, `packet` | count     | null   | null   |

## 5. Acceptance Criteria

- **AC-001**: Given a user adds recipe `42` to the cart, When `addToShoppingList(42)` is dispatched, Then `useShoppingListStore.getState().shoppingList` includes `42` and `localStorage['shopping-list']` reflects the new value.
- **AC-002**: Given a user changes the wanted servings for recipe `7` to `4`, When `setRecipesQuantities(7, 4)` is dispatched, Then `useRecipeQuantitiesStore.getState().recipesQuantities[7] === 4` and `localStorage['recipe-quantities']` reflects the new value.
- **AC-003**: Given a recipe with `servings = 2` and an ingredient line of `200 g`, When the user sets `wantedQuantity = 4`, Then the scaled line equals `400 g`.
- **AC-004**: Given two recipes both containing ingredient `id=10` with `100 g` and `0.2 kg` respectively and `preferredUnitSlug = 'g'`, When `useShoppingList` aggregates, Then `primary` is `{ quantity: 300, unitSlug: 'g' }` and `fallback` is empty.
- **AC-005**: Given an ingredient line in `piece` with no `countWeightG` and a `preferredUnitSlug = 'g'`, When aggregation runs, Then the line is placed in `fallback` keyed by `'piece'` and is not added to `primary`.
- **AC-006**: Given two child ingredients of parent `P` with primary quantities `100` and `250`, When parent rollup runs, Then `P.primary.quantity` is increased by `250` (the max), the children are removed from the final list, and any pre-existing parent quantity is preserved.
- **AC-007**: Given a recipe with a `linkedRecipe` whose `servings = 4` and `ratio = 2` and a linked ingredient `300 g`, When projected by `getRecipesByIds`, Then the parent's flattened line for that ingredient has `quantity = (300 * 2) / 4 = 150 g`.
- **AC-008**: Given the page loads at `/shopping-list` with an empty selection, When SSR renders the document, Then no shopping-list content is server-rendered and `<ShoppingListPending />` is shown until the client hydrates.
- **AC-009**: Given the cart has at least one ingredient, When `<CartItem>`'s checkbox is checked, Then the row text receives `line-through` styling and the primary + fallback lines remain visible.
- **AC-010**: Given the user clicks `<ResetCartButton />`, When the click is handled, Then `shoppingList` becomes `[]` and the rendered groups are cleared (subject to query refetch on the new key `[]`).
- **AC-011**: Given an ingredient where `preferredUnitSlug` is `null`, When aggregation picks `targetSlug`, Then it falls back to the first line's `unitSlug` (which may itself be `null`).
- **AC-012**: Given an ingredient row has `category === 'spices'`, When `getRecipesByIds` runs, Then that row is excluded from `groupIngredients` at the SQL layer and never appears in `useShoppingList` output.
- **AC-013**: Given the shopping list contains ingredients across multiple categories, When `<ShoppingList />` renders, Then there is exactly one `<h2>` per category with the matching icon and label, and each `<CartItem>` appears under its category.

## 6. Test Automation Strategy

- **TST-001**: Unit-test `convert()` for: same-slug pass-through, scaled within-dimension chains (`kg <-> g`, `l <-> ml <-> tbsp <-> tsp`), cross-dimension via `densityGPerMl` (volume <-> mass) and `countWeightG` (count <-> mass), and `null` returns for missing meta or unrelated count units.
- **TST-002**: Unit-test the aggregation pipeline in `useShoppingList` (extract pure helpers if needed) covering: scaling, primary+fallback split, parent/child rollup with `Math.max`, multi-recipe accumulation, and `wantedQuantity` defaulting to `recipe.servings`.
- **TST-003**: Snapshot/component test `<CartItem>` for the unchecked state, the checked (`line-through`) state, the unitless variant, and the multi-fallback variant.
- **TST-004**: Component test `<ShoppingList>` rendering one section per category, in the order yielded by `typedEntriesOf`, with the right icon + label.
- **TST-005**: Integration test the route `/shopping-list`: with empty selection it renders the `Skeleton` fallback; with selection it renders the suspense fallback then the populated list after the query resolves.
- **TST-006**: Store tests assert `persist` keys (`shopping-list`, `recipe-quantities`), `partialize` output, and the reducer behavior of all actions.
- **TST-007**: Server-function test of `getRecipesByIds` validates: rejection of non-array inputs by Zod, exclusion of spices via `ingredientGroupSelect`, and linked-recipe scaling math.
- **TST-008**: Tests run via `vp test` (Vitest) using imports from `vite-plus/test`.

## 7. Rationale & Context

### 7.1 Why two stores

Selection (`shoppingList: number[]`) and serving overrides (`recipesQuantities`) are intentionally decoupled.
A user can remove a recipe from the cart without losing their custom servings preference for next time, and
the `recipe-quantities` store can be read from non-cart UIs (recipe detail, recipe card) without coupling to
cart membership.

### 7.2 Why client-only

Both stores rely on `localStorage`, which is unavailable on the server. The `'@tanstack/react-start/client-only'`
import directive tells the bundler to keep the module out of the SSR bundle. The `/shopping-list` route
double-wraps its content in `<ClientOnly>` + `<Suspense>` so that:

1. SSR renders the `<ShoppingListPending />` skeleton instead of attempting to read missing state.
2. The client-side `useSuspenseQuery` can suspend cleanly until the projection resolves.

### 7.3 Why server projects, client aggregates

Aggregation depends on user-side data (`recipesQuantities`) that the server does not see. Doing the join +
projection on the server keeps the wire payload small and authoritative; doing the scaling, conversion,
rollup, and grouping on the client keeps the server function cacheable per `ids` set.

### 7.4 Why `Math.max` for child rollup

When a recipe asks for both a parent ingredient (e.g. "tomato") and a child variant (e.g. "cherry tomato"),
buying the larger of the two quantities is enough to satisfy both. Summing would over-buy.

### 7.5 Why the cache key includes the full ids array

`queryKeys.recipeListByIds(ids)` embeds the array, which means each unique selection is its own cache entry.
This trades cache growth for simplicity and cache-hit predictability when a user toggles items repeatedly.

### 7.6 Why fallback lines

When unit conversion is impossible (e.g. `piece` with no `countWeightG` while target is `g`), silently
dropping the line would mislead the shopper. Showing the residual quantity in its original unit, muted under
the primary, surfaces the partial information without polluting the primary aggregate.

## 8. Dependencies & External Integrations

| Dependency                                                                                 | Role                                                                   |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `zustand` + `zustand/middleware`                                                           | Client store + `localStorage` persistence.                             |
| `@tanstack/react-start`                                                                    | Server function (`createServerFn`) and `client-only` import directive. |
| `@tanstack/react-router`                                                                   | `createFileRoute` + `ClientOnly`.                                      |
| `@tanstack/react-query`                                                                    | `queryOptions` + `useSuspenseQuery`.                                   |
| `zod`                                                                                      | Input validation for `getRecipesByIds`.                                |
| `drizzle-orm` (via `getDb`)                                                                | Relational query for recipes + ingredient groups + linked recipes.     |
| `@phosphor-icons/react`                                                                    | `ArrowCounterClockwiseIcon` in `ResetCartButton`.                      |
| Internal: `@/lib/db/schema/unit`                                                           | `UNITS`, `UnitSlug`, `Dimension`.                                      |
| Internal: `@/utils/unit-converter`                                                         | `convert(...)`.                                                        |
| Internal: `@/utils/error-handler`                                                          | `withServerError` wrapper.                                             |
| Internal: `@/lib/query-keys`                                                               | `queryKeys.recipeListByIds`.                                           |
| Internal: `@/features/ingredients/utils/constants`                                         | `ingredientCategoryIcons`, `ingredientCategoryLabels`.                 |
| Internal: `@/components/ui/checkbox`, `@/components/ui/button`, `@/components/ui/skeleton` | UI primitives.                                                         |
| Internal: `@/utils/number`                                                                 | `formatNumber`.                                                        |
| Internal: `@/utils/object`                                                                 | `typedEntriesOf`.                                                      |

## 9. Examples & Edge Cases

### 9.1 Scaling

```
recipe.servings = 2
wantedQuantity = recipesQuantities[recipe.id] ?? 2 = 5
ingredient.quantity = 200, unitSlug = 'g'
scaledQty = (200 * 5) / 2 = 500
```

### 9.2 Multi-recipe aggregation with conversion

```
Ingredient id=10, preferredUnitSlug='g', densityGPerMl=null, countWeightG=null
Recipe A line: 100 g
Recipe B line: 0.2 kg  -> convert(0.2, 'kg', 'g', { ... }) = 200 g
primary = { quantity: 300, unitSlug: 'g' }
fallback = []
```

### 9.3 Fallback when unit cannot convert

```
Ingredient id=11, preferredUnitSlug='g', countWeightG=null
Recipe A line: 50 g
Recipe B line: 2 piece   -> tryConvert -> null (missing countWeightG)
primary = { quantity: 50, unitSlug: 'g' }
fallback = [{ quantity: 2, unitSlug: 'piece' }]
```

### 9.4 Parent/child rollup

```
Ingredient parent P (primary = 100 g), child C1 (primary = 80 g), child C2 (primary = 250 g)
Children removed; P.primary.quantity = 100 + max(80, 250) = 350 g
```

### 9.5 Linked-recipe flattening

```
Parent recipe pulls linkedRecipe with servings=4, ratio=2.
Linked ingredient line: 300 g
Flattened into parent: (300 * 2) / 4 = 150 g
```

### 9.6 Edge cases

- Empty `shoppingList`: `useShoppingList` calls `getRecipeByIdsOptions([])`, yielding an empty array; `shoppingListIngredients` is `{}`; the page renders no groups.
- A recipe id present in `shoppingList` but missing in the DB (deleted): the server returns no row for it; aggregation simply ignores it.
- `recipesQuantities[id]` set to `0`: `wantedQuantity = 0`, all scaled quantities are `0`. The list still groups by category but every quantity is zero.
- All lines for an ingredient have `unitSlug = null` and `preferredUnitSlug = null`: `targetSlug = null`, `tryConvert` returns the quantity unchanged (`line.unitSlug === targetSlug`), and `primary` sums them with `unitSlug: null` (no unit label rendered).
- Mixed convertible and unconvertible lines: the convertible ones go into `primary`, the rest into `fallback` keyed by their original `unitSlug`.

## 10. Validation Criteria

- **VAL-001**: `vp check` passes (format + lint + types) for all files in `src/features/shopping-list/**`, `src/stores/{shopping-list,recipe-quantities}.store.ts`, `src/utils/unit-converter.ts`, and `src/routes/shopping-list.tsx`.
- **VAL-002**: `vp test` passes the suites described in section 6.
- **VAL-003**: Manual smoke: navigate to a recipe detail, change wanted servings via the quantity control (writes `recipesQuantities`), click "add to list" (writes `shoppingList`), navigate to `/shopping-list`. The list reflects the chosen servings, groups by category, and the reset button empties the list.
- **VAL-004**: SSR sanity: the first server response for `/shopping-list` MUST NOT contain any rendered `<CartItem>` (only the skeleton fallback).
- **VAL-005**: Persistence: after a hard reload, `shoppingList` and `recipesQuantities` are restored from `localStorage` keys `shopping-list` and `recipe-quantities`.
- **VAL-006**: Spices invariant: a recipe containing only `spices`-category ingredients results in zero entries in the cart for that recipe (linked recipes included).

## 11. Related Specifications / Further Reading

- [Architecture overview](../../docs/architecture.spec.md)
- [Client State Layering](../../docs/infrastructure/client-state.spec.md)
- [Data Layer (Drizzle + D1)](../../docs/infrastructure/data-layer.spec.md)
- [Recipe feature spec](../recipe/spec/index.spec.md)
- [Ingredients feature spec](../ingredients/ingredients.spec.md)
