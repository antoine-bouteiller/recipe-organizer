---
title: Shopping List
status: amended
author: Antoine Bouteiller
date: 2026-04-18
related: [../recipe/spec/index.spec.md, ../ingredients/ingredients.spec.md, ../../../docs/specs/unit.spec.md]
---

## 2. Problem Statement

Users plan a meal or a week by dropping several recipes into a "cart" and cooking from the same grocery run. The
app must:

- `[G-1]` Let the user add/remove recipes to a cart from anywhere in the app (recipe detail page, etc.).
- `[G-2]` Aggregate all ingredients from cart recipes into a single shopping list, scaled to the user's desired
  servings per recipe.
- `[G-3]` Expand linked sub-recipes transparently — if Recipe A uses Recipe B at ratio 0.5, include B's
  ingredients scaled by 0.5.
- `[G-4]` Collapse ingredient variants (cherry tomato + regular tomato) into a single line so the grocery run
  doesn't show three tomato rows.
- `[G-5]` Group the list by ingredient category (meat, fish, vegetables, spices, other) with icons, matching the
  shopping aisle mental model.
- `[G-6]` Persist cart + per-recipe desired servings across page reloads and sessions (localStorage).
- `[G-7]` Let the user check off items as they shop (ephemeral, not persisted — see `[NG-1]`).
- `[G-8]` Present each aggregated ingredient in a unit the user can actually buy in — mass for flour, volume for
  milk, count for eggs — by converting all contributing lines into the ingredient's preferred unit before summing.

## 3. Key Design Decisions

| Decision                                   | Choice                                                                                                                                                                                                    | Rationale                                                                                                                                         |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Cart is client-only state         | Zustand store + `persist` middleware → localStorage (key: `shopping-list`)                                                                                                                                | Cart is inherently per-device / per-browser; no server round-trip; survives offline.                                                              |
| `[KD-2]` Servings override is client-only  | Separate Zustand store `recipe-quantities.store.ts` persists `{recipeId: desiredServings}`                                                                                                                | Keeps "how much I'm cooking" separate from the cart set; also used on recipe detail page for live scaling.                                        |
| `[KD-3]` Single server query for cart      | `getRecipesByIds([...ids])` fetches all cart recipes + their ingredients + linked recipes in one call                                                                                                     | Avoids N+1; one `queryKey: recipeListByIds(ids)` entry.                                                                                           |
| `[KD-4]` Aggregation happens client-side   | `useShoppingList` hook composes server data + quantities + variant collapsing                                                                                                                             | Aggregation depends on client-only state (desired servings); no server role here.                                                                 |
| `[KD-5]` Variant collapsing = max, not sum | If multiple recipes use both cherry tomato and tomato, show parent tomato with `parentQty + childQty` (parent line is `max(childQuantities) + parentQuantity`)                                            | "How many tomatoes do I buy?" is best answered by "enough to cover the biggest recipe that needs cherry tomato, plus any that need plain tomato". |
| `[KD-6.1]` Conversion-aware aggregation    | Each line is converted to the ingredient's `preferredUnitSlug` (fallback: first seen slug) via `convert()` from `src/utils/unit-converter.ts`; un-convertible lines fall through as a secondary breakdown | Gives a single "buy this much" total per ingredient while keeping partial information visible when metadata is missing.                           |
| `[KD-7]` ClientOnly wrapper for the UI     | Shopping list route renders behind `ClientOnly` because Zustand stores are client-only                                                                                                                    | Avoids SSR flicker / hydration mismatch when reading localStorage.                                                                                |
| `[KD-8]` Conversion runs client-side       | Conversion is a pure function over the cart + ingredient catalog; the unit catalog is a static import (`src/lib/db/schema/unit.ts`), not a fetched resource                                               | No extra round-trip; same input ⇒ same output; tests can be pure unit tests.                                                                      |

## 4. Principles & Intents

- `[PI-1]` **The cart is UI state, not app data** — no DB table for shopping lists. A user's cart is stored in
  their browser.
- `[PI-2]` **Aggregation is lossy by design** — the list shows totals per ingredient, not per source recipe. Users
  who want to see which recipe contributed a given item must go back to the recipe page.
- `[PI-3]` **Checked state is ephemeral** — checking a box is a momentary "I got this" flag; navigating away loses
  it. See `[NG-1]`.
- `[PI-4]` **Sub-recipe expansion scales with ratio** — an `IngredientGroup` on a linked recipe contributes
  `quantity * ratio / linkedRecipe.servings` per serving of the parent, not a flat `quantity * ratio`. See server
  query at `get-recipe-by-ids.ts:76`.
- `[PI-5]` **Lossy aggregation beats wrong aggregation** — when a line cannot be converted into the preferred
  unit (no density, unknown count weight), it is shown as a secondary breakdown line, never silently merged
  into the main total. A wrong number is worse than two honest numbers.
- `[PI-6]` **Preferred-unit is a per-ingredient choice** — flour in grams, milk in ml, eggs in count. The cart
  does not try to re-derive the "right" unit from context; it trusts `ingredient.preferredUnitSlug`.

## 5. Non-Goals

- `[NG-1]` Persisting checked / unchecked state of items across sessions.
- `[NG-2]` Sharing a shopping list with another user (server-side lists, QR codes, export links).
- `[NG-3.1]` Cross-ingredient aggregation (e.g., summing all "leafy greens" into one line).
- `[NG-4]` Purchase history or "already bought" tracking.
- `[NG-5]` Quantity arithmetic per recipe in the cart UI — users set desired servings on the recipe detail page,
  not on the shopping-list page.
- `[NG-6]` Rounding of converted quantities to "nice" shopping values (e.g., rounding 283 g to the nearest
  250 g pack). The number shown is the computed total.

## 6. Caveats

- `[C-1]` Cart state is client-side only; clearing browser storage clears the cart. The reset button
  (`ResetCartButton`) does this deliberately.
- `[C-2.1]` Aggregation quality depends on the ingredient's conversion metadata. An ingredient with no
  `densityGPerMl` and no `countWeightG` cannot have volume/count lines folded into its mass preferred unit;
  those lines surface as a secondary "+ X cup, + Y tbsp" breakdown under the primary quantity. Filling in
  density on frequently used ingredients is the fastest path to cleaner lists.
- `[C-3]` Variant collapsing only handles a single level (parent ↔ child). Grandparent hierarchies are not
  collapsed transitively.
- `[C-4]` `useShoppingList` uses `useSuspenseQuery`, which means the shopping-list route MUST be wrapped in a
  Suspense boundary to avoid blowing up rendering. Today `src/routes/shopping-list.tsx` handles this.
- `[C-5]` The cart array (`number[]`) is not deduplicated — if the "add to cart" action is accidentally bound to a
  non-idempotent UI path, a recipe can appear twice and double-contribute. Today the UI only exposes add/remove
  via the recipe detail page, which is an idempotent toggle.
- `[C-6]` Conversion uses `Number`-precision floats. Accumulating many lines (20+) into a single unit can drift
  by sub-gram amounts. Acceptable for groceries; not fit for baking-by-the-gram precision.

## 7. High-Level Components

| Component           | Module type     | Responsibility                                                                                                                        | Public API surface                                                                                          |
| ------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Cart store          | Zustand store   | Client-only persisted list of recipe IDs in the cart                                                                                  | `useShoppingListStore` (`shoppingList`, `addToShoppingList`, `removeFromShoppingList`, `resetShoppingList`) |
| Recipe-quantities   | Zustand store   | Client-only persisted map of `{recipeId → desiredServings}`                                                                           | `useRecipeQuantitiesStore`                                                                                  |
| Cart data fetch     | Server function | Batch read recipes + ingredient groups + linked recipes for the given IDs                                                             | `getRecipeByIdsOptions(ids)`                                                                                |
| Aggregation hook    | React hook      | Joins store state + server data; expands linked recipes; collapses variants; converts each line to preferred unit; groups by category | `useShoppingList()`                                                                                         |
| Conversion lib      | TS lib          | Pure `convert(qty, fromSlug, toSlug, ingredient): number \| null` — see `docs/specs/unit.spec.md`                                     | `convert`, `toCanonicalBase`, type exports                                                                  |
| Unit catalog        | Static TS data  | Source of truth for units, imported wherever conversion happens                                                                       | `UNITS`, `UnitSlug`, `Unit`, `getUnit(slug)` from `src/lib/db/schema/unit.ts`                               |
| Shopping list page  | Route           | Renders the grouped list with category headers; handles Suspense + ClientOnly                                                         | `GET /shopping-list`                                                                                        |
| Cart item component | React component | Single ingredient row with checkbox + quantity + unit                                                                                 | `<CartItem />`                                                                                              |
| Reset button        | React component | Clears the Zustand cart store                                                                                                         | `<ResetCartButton />`                                                                                       |

## 8. Detailed Design

| Component        | Entry point                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| Cart store       | `src/stores/shopping-list.store.ts`                                             |
| Quantities store | `src/stores/recipe-quantities.store.ts`                                         |
| Data fetch       | `src/features/shopping-list/api/get-recipe-by-ids.ts` → `getRecipeByIdsOptions` |
| Aggregation hook | `src/features/shopping-list/hooks/use-shopping-list.ts` → `useShoppingList`     |
| Shared type      | `src/features/shopping-list/types/ingredient-cart-item.ts`                      |
| Query helper     | `src/features/shopping-list/utils/ingredient-group-select.ts`                   |
| List page        | `src/features/shopping-list/component/shopping-list.tsx`                        |
| Cart item        | `src/features/shopping-list/component/cart-item.tsx`                            |
| Reset button     | `src/features/shopping-list/component/reset-cart-button.tsx`                    |
| Route            | `src/routes/shopping-list.tsx`                                                  |
| Query key        | `src/lib/query-keys.ts` → `queryKeys.recipeListByIds(ids)`                      |
| Conversion lib   | `src/utils/unit-converter.ts` (see `docs/specs/unit.spec.md`)                   |

Key behaviors to preserve in future edits:

- Sub-recipe ingredient scaling formula: `quantity = groupIngredient.quantity * ratio / linkedRecipe.servings`
  (per serving of the parent recipe), then multiplied by `wantedQuantity / recipe.servings` in the hook. Any
  refactor must preserve both factors.
- Variant collapsing iterates `ingredientsMap` twice: once to compute `parentQuantities` (max of child quantities
  per parent ID) and `childrenIds`, then filters out children and adds `parentQuantity` back onto parent rows.
- Category grouping preserves ingredient-catalog ordering within each category (Map insertion order).
- Per-ingredient aggregation shape after conversion:
  ```typescript
  type AggregatedIngredient = {
    readonly ingredientId: number
    readonly name: string
    readonly category: IngredientCategory
    readonly primary: { readonly quantity: number; readonly unitSlug: UnitSlug | null } // sum in the preferred unit (or first seen slug)
    readonly fallback: ReadonlyArray<{ readonly quantity: number; readonly unitSlug: UnitSlug | null }> // un-convertible lines, per source slug
  }
  ```
  `primary.unitSlug` is `ingredient.preferredUnitSlug` when any contributing line converts into it; otherwise
  it is the first slug seen for this ingredient across the cart. `fallback` is empty when every line converted
  cleanly into `primary.unitSlug`.

## 9. Verification Criteria

- `[VC-1]` Adding a recipe via `addToShoppingList(id)` persists across page reloads (localStorage key
  `shopping-list`).
- `[VC-2]` Removing a recipe from the cart removes it from the aggregation on next render.
- `[VC-3]` Setting `recipesQuantities[recipeId] = N` on the quantities store scales that recipe's ingredient
  contribution to `N / recipe.servings` of the base per-serving quantities.
- `[VC-4]` A linked sub-recipe at ratio 0.5 with `servings=2` contributes each of its ingredients at
  `baseQty * 0.5 / 2` per serving of the parent.
- `[VC-5]` Cart with two recipes where one uses "tomato" (parent, 200g) and the other uses "cherry tomato"
  (child, 150g) renders a single "tomato" line at `max(150) + 200 = 350g`.
- `[VC-6]` Category grouping puts ingredients under `meat | fish | vegetables | spices | other` headers and
  skips empty categories.
- `[VC-7]` `ResetCartButton` empties `shoppingList` but does NOT clear `recipesQuantities` (intentional, so
  previously-set servings are remembered if the recipe re-enters the cart).
- `[VC-8]` `/shopping-list` renders without hydration errors when the page is visited directly (ClientOnly guard).
- `[VC-9]` `useShoppingList` suspends while `getRecipeByIdsOptions(ids)` is loading and resumes with data.
- `[VC-10]` Lint + typecheck pass: `pnpm lint`, `pnpm typecheck`.
- `[VC-11]` Cart with two recipes — one uses `200 g` flour, the other `2 CàS` flour — aggregates into a single
  flour line in the ingredient's preferred unit (`g`) when `densityGPerMl` is configured. Expected:
  `200 + 2 * 15 * 0.55 = 216.5 g` (approx).
- `[VC-12]` Cart with two recipes both using "flour" (no density configured) but in different units (`g`, `cas`)
  renders a single ingredient entry with `primary` in the first seen slug and the other line as `fallback`.
- `[VC-13]` Cart with a recipe calling `3 pieces` egg and another calling `100 g` egg — when `countWeightG = 50`
  is configured — aggregates to `250 g` when the egg's `preferredUnitSlug = 'g'`, OR to `5 pieces` when the
  preferred slug is `'piece'` (`100 / 50 + 3`).
- `[VC-14]` An ingredient whose `preferredUnitSlug` is not present in `UNITS` (stale row after a catalog
  removal) does not crash `useShoppingList`; the primary unit falls back to the first seen slug across the
  cart lines.

## 10. Open Questions

- `[OQ-1]` Should checked items persist across sessions? Currently lost on reload.
- `[OQ-2]` Should the cart de-duplicate on `addToShoppingList` (Set semantics) to guard against the hypothetical
  double-add bug?

## Changelog

| Date       | Amendment                                                                                                        | Sections affected          | Reason                                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-18 | Replace "no unit conversion" with conversion-aware aggregation via the new `src/utils/unit-converter.ts` library | 2, 3, 4, 5, 6, 7, 8, 9, 10 | Make the shopping list actionable for real grocery runs; resolve former `[OQ-3]` and the "last unit wins" limitation from `[C-2]`. |
| 2026-04-18 | Switch unit identity from `unit_id` to `unit_slug` in aggregation shape and VCs                                  | 3, 4, 6, 7, 8, 9           | Units moved to a hardcoded catalog; `UnitSlug` is now the persisted identity.                                                      |
