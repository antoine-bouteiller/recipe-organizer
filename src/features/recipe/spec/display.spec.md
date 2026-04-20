---
title: Recipe display, scaling, list, search, form
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related: [./index.spec.md, ./crud.spec.md, ./editor.spec.md]
---

## 2. Problem Statement

Once recipes exist on the server, the app needs user-facing surfaces to browse, filter, read, author, and scale
them:

- `[G-1]` Home page shows a grid of recipe cards (image + name + tags), cacheable & fast on repeat visits.
- `[G-2]` Search page filters the same list by substring of the recipe name, with an auto-focused input.
- `[G-3]` Recipe detail page shows image/title, tags, live-scaled ingredient list, rich-text instructions, and
  sub-recipe ingredients inlined into the ingredient column.
- `[G-4]` Detail page is responsive: stacked tabs on mobile (`Ingrédients` / `Préparation`, with swipe), grid on
  desktop.
- `[G-5]` Detail page exposes quantity controls: the user sets desired servings per recipe, ingredients rescale
  live, and the recipe can be added to the shopping list from the same control.
- `[G-6]` Create + edit pages share a single form component (`RecipeForm` via `withForm`) with ingredient-group
  and linked-recipe array fields, an image uploader, and the Lexical `EditorField` for instructions.
- `[G-7]` Only the recipe's creator (or an admin) sees the "edit" and "delete" menu actions on the detail page.

## 3. Key Design Decisions

| Decision                                  | Choice                                                                                                               | Rationale                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `[KD-1]` Client-side filtering            | Search page reads the full `getRecipeListOptions()` list and filters in memory                                       | Recipe volume is small; avoids a second server endpoint and lets search leverage the existing cache. |
| `[KD-2]` Scaling via Zustand              | `useRecipeQuantities(recipeId, base)` reads / writes `useRecipeQuantitiesStore`                                      | Scaling is per-device personal state (see shopping-list spec `[KD-2]`). No server write.             |
| `[KD-3]` Sub-recipe ingredients on detail | Detail page appends each linked recipe's default ingredient group, using the linked recipe's name as the group title | Keeps the ingredients column complete without re-entering data.                                      |
| `[KD-4]` Swipe tabs on mobile             | `useSwipeTabs` hook drives between `ingredients` / `preparation` on `/recipe/$id`                                    | Feels native; matches the shopping-list use case where the user switches contexts often.             |
| `[KD-5]` `RecipeForm` = `withForm`        | Defined once, used by both `new.tsx` and `edit.$id.tsx` route components                                             | One form, two call sites; default values and field maps centralized in `utils/form.ts`.              |
| `[KD-6]` Route loaders pre-fetch          | Each route's `loader` calls `context.queryClient.ensureQueryData(...)` for its data                                  | Server-rendered first paint includes real data; TanStack Query hydrates the cache.                   |
| `[KD-7]` `RecipeCard` = grid unit         | Shared across home and search                                                                                        | Single visual treatment for a recipe in a list.                                                      |
| `[KD-8]` Edit/delete menu gated           | `DotsThreeVerticalIcon` popover on detail page only rendered when `authUser` is truthy                               | Not a security boundary — server re-checks creator/admin — but avoids UI clutter.                    |

## 4. Principles & Intents

- `[PI-1]` **Scaling is visual, not stored** — no mutation when the user bumps servings on detail. Only the
  client-side store changes.
- `[PI-2]` **One card component** — list surfaces (home, search) all use `<RecipeCard>`.
- `[PI-3]` **Linked-recipe ingredients are always shown on detail** — using the linked recipe's default
  ingredient group + its name as the section header. This is the only place sub-recipes are expanded at read
  time on the detail page (the shopping list expands more exhaustively).
- `[PI-4]` **French-first copy** — all button labels and placeholders in French. See existing strings like
  `Ajouter à la liste de courses`, `Ingrédients`, `Préparation`.

## 5. Non-Goals

- `[NG-1]` Server-side search endpoint.
- `[NG-2]` Infinite scroll / pagination on the home grid.
- `[NG-3]` Favorites / starred recipes feature.
- `[NG-4]` Multi-select bulk actions on the list.
- `[NG-5]` Share-by-link deep linking beyond `/recipe/$id`.

## 6. Caveats

- `[C-1]` The detail page inlines each linked recipe's **default** ingredient group only
  (`where: { isDefault: true }`) — non-default groups of a linked recipe are not shown on the parent's detail.
  This matches how linked-recipe ingredients are typically used ("the dough") but can surprise authors who split
  linked recipes into multiple groups.
- `[C-2]` `QuantityControls` disables the decrement button when `quantity === 1` but allows increment without an
  upper bound. Very large numbers will render without a cap.
- `[C-3]` The detail page uses `useQuery(getRecipeDetailsOptions(id))` (not suspense) and renders `null` while
  loading, because `ensureQueryData` has already primed the cache from the loader. A cache miss on client
  navigation will briefly render nothing.
- `[C-4]` The "Ajouter à la liste de courses" / "Supprimer de la liste" button state depends on
  `useIsInShoppingList`, which reads the Zustand cart store — requires `ClientOnly` wrapping.
- `[C-5]` The search page's filter compares raw `recipe.name` substrings; no accent folding or fuzzy matching.
  "café" will not match "cafe".

## 7. High-Level Components

| Component                  | Module type          | Responsibility                                                      | Public API surface                                           |
| -------------------------- | -------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Home page                  | Route                | Grid of `<RecipeCard>`; FAB on mobile to create                     | `GET /`                                                      |
| Search page                | Route                | Filtered list with search input                                     | `GET /search`                                                |
| Detail page                | Route                | Full recipe view with tabs/grid, scaling, edit/delete menu          | `GET /recipe/$id`                                            |
| New recipe page            | Route                | Blank `<RecipeForm>` + submit handler calling `createRecipeOptions` | `POST /recipe/new` (via form)                                |
| Edit recipe page           | Route                | Pre-filled `<RecipeForm>` + submit calling `updateRecipeOptions`    | `POST /recipe/edit/$id` (via form)                           |
| `<RecipeForm>`             | `withForm` component | Reusable form for create + edit; validates via `recipeSchema`       | `<RecipeForm />`                                             |
| `<RecipeCard>`             | React component      | Image + name + tag chips, link to detail                            | `<RecipeCard recipe={...} />`                                |
| `<RecipeIngredientGroups>` | React component      | Renders ingredient groups scaled by current per-recipe quantity     | `<RecipeIngredientGroups ... />`                             |
| `<QuantityControls>`       | React component      | Servings +/- + add/remove-from-cart composite control               | `<QuantityControls recipeId servings variant? className? />` |
| `<IngredientGroupField>`   | Form array field     | Manages `ingredientGroups` array with nested ingredient picker rows | `<IngredientGroupField />`                                   |
| `<SearchBar>`              | React component      | Filter input for `/search`                                          | `<SearchBar />`                                              |
| `<DeleteRecipe>`           | React component      | Confirmation dialog wrapping `deleteRecipeOptions`                  | `<DeleteRecipe recipeId recipeName />`                       |
| `useRecipeQuantities`      | React hook           | Per-recipe scaling helpers (quantity, increment, decrement)         | `useRecipeQuantities(recipeId, defaultValue)`                |
| `useIsInShoppingList`      | React hook           | Reads the cart store to check membership                            | `useIsInShoppingList(recipeId)`                              |
| `useSwipeTabs`             | React hook           | Gesture-driven tab navigation                                       | From `@/hooks/use-swipe-tabs`                                |
| Form defaults / field map  | Utility module       | Default values, `fieldMap` for `withForm`                           | `src/features/recipe/utils/form.ts`                          |

## 8. Detailed Design

| Component              | Entry point                                                 |
| ---------------------- | ----------------------------------------------------------- |
| Home                   | `src/routes/index.tsx`                                      |
| Search                 | `src/routes/search.tsx`                                     |
| Detail                 | `src/routes/recipe/$id.tsx`                                 |
| New                    | `src/routes/recipe/new.tsx`                                 |
| Edit                   | `src/routes/recipe/edit.$id.tsx`                            |
| RecipeForm             | `src/features/recipe/components/recipe-form.tsx`            |
| RecipeCard             | `src/features/recipe/components/recipe-card.tsx`            |
| IngredientGroupField   | `src/features/recipe/components/ingredient-group-field.tsx` |
| SearchBar              | `src/features/recipe/components/search-bar.tsx`             |
| QuantityControls       | `src/features/recipe/components/quantity-controls.tsx`      |
| RecipeIngredientGroups | `src/features/recipe/components/recipe-section.tsx`         |
| DeleteRecipe           | `src/features/recipe/components/delete-recipe.tsx`          |
| Scaling hook           | `src/features/recipe/hooks/use-recipe-quantities.ts`        |
| In-cart hook           | `src/features/recipe/hooks/use-is-in-shopping-list.ts`      |
| Form defaults          | `src/features/recipe/utils/form.ts`                         |
| Recipe title helper    | `src/features/recipe/utils/get-recipe-title.ts`             |

Scaling formula (see `recipe-section.tsx:19`):

```typescript
const scaled = (groupIngredient.quantity * currentServings) / baseServings
```

Linked-recipe display on detail (see `$id.tsx:34`):

```typescript
const ingredientGroups = [
  ...recipe.ingredientGroups,
  ...recipe.linkedRecipes.map(({ linkedRecipe }) => ({
    ...linkedRecipe.ingredientGroups[0], // default group only
    groupName: linkedRecipe.name,
    isDefault: false,
  })),
]
```

## 9. Verification Criteria

- `[VC-1]` `/` renders a grid ordered alphabetically by `recipe.name`. Response carries
  `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` (set on the detail route, confirm on
  home if desired).
- `[VC-2]` `/search` auto-focuses its input; typing filters the rendered list by substring of `name`, updating
  on every keystroke.
- `[VC-3]` `/recipe/$id` on mobile shows `Ingrédients` + `Préparation` tabs; swiping between them updates the
  active tab; on desktop, both columns render side-by-side (`md:grid-cols-5`).
- `[VC-4]` `<QuantityControls>`: clicking `+` / `-` updates `useRecipeQuantitiesStore`; the decrement button is
  disabled at `quantity === 1`. The "add to list / remove from list" button toggles `useShoppingListStore` and
  its label flips accordingly.
- `[VC-5]` Ingredient lines render scaled quantities: `(baseQuantity * currentServings) / baseServings`,
  formatted via `formatNumber`.
- `[VC-6]` Linked recipes appear under their own section (titled by linked recipe's `name`) below own
  ingredient groups, using only the linked recipe's default ingredient group.
- `[VC-7]` The edit/delete popover menu is hidden when `authUser` is falsy and visible when truthy. Clicking
  delete opens a confirmation dialog; confirming calls `deleteRecipeOptions()`.
- `[VC-8]` `/recipe/new` and `/recipe/edit/$id` both mount `<RecipeForm>` with matching field sets; the edit
  route pre-fills with data from `getRecipeDetailsOptions(id)`.
- `[VC-9]` Submitting the form uses FormData (via `objectToFormData`) so image and video files land in the
  server handler as `File` instances.
- `[VC-10]` Lint + typecheck pass.

## 10. Open Questions

- `[OQ-1]` Should the search page offer accent-insensitive / fuzzy matching?
- `[OQ-2]` Should `QuantityControls` cap servings at some large number (e.g., 99) to avoid absurd scaled totals
  on the shopping list?
- `[OQ-3]` Should linked-recipe sections on the detail page show all ingredient groups, not just the default?
