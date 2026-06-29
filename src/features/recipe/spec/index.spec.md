---
title: Recipe Feature - Overview
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [feature, recipe, overview, index]
---

# Introduction

The `recipe` feature is the largest and most central feature of the recipe-organizer app. It owns the
recipe domain (recipes, ingredient groups, linked sub-recipes, instructions), the rich-text editor
(Lexical with custom Magimix and Subrecipe nodes), the recipe listing/detail UI, the search bar, and
the integration with the shopping list and ingredient features.

This index spec is the entry point. It describes the feature topology, the cross-feature flows, and
the canonical glossary. Implementation detail lives in the three sub-specs colocated with the code:

- [crud.spec.md](./crud.spec.md) — create / update / delete server functions, R2 uploads, auto-tag
  computation, batched relational deletes, ownership checks.
- [display.spec.md](./display.spec.md) — list page, detail page (mobile tabs+swipe / desktop
  two-column grid), recipe card, search bar, quantity controls, shopping-list integration.
- [editor.spec.md](./editor.spec.md) — Lexical editor integration, custom `MagimixProgramNode`,
  custom `SubrecipeNode`, dialogs, JSON serialization round-trip, auto-tag detection contract.

## 1. Purpose & Scope

### Purpose

Provide the end-user with the complete recipe lifecycle: create a recipe with structured ingredients,
embed Magimix programs and other recipes inside its instructions, browse a card grid, scale servings,
add the recipe to a shopping list, and edit or delete it.

### In scope

- `src/features/recipe/**` (api, components, contexts, hooks, types, utils)
- `src/routes/recipe/{$id,edit.$id,new}.tsx` (recipe routes)
- `src/routes/index.tsx` (recipe list home page)
- `src/routes/search.tsx` (recipe search list)
- `src/lib/db/schema/{recipe,recipe-ingredients,recipe-linked-recipes}.ts` (DB shape)
- The R2 upload contract used by the recipe feature (`src/lib/r2.ts`,
  `src/routes/api/{image,video}/$id.ts`).

### Out of scope

- Authentication and `authGuard` middleware (see `src/lib/auth/auth-guard.ts`).
- Ingredient catalog management (see `src/features/ingredients/`).
- Shopping list page UI and aggregation logic (see `src/features/shopping-list/`).
- The shared Lexical `Editor` component itself (see `src/components/common/editor/`); only the recipe
  feature's custom nodes registered through `recipeNodes` are owned here.

## 2. Definitions

| Term                       | Meaning                                                                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recipe                     | A row in `recipes(id, name, image, instructions, servings, tags JSON, video, createdBy)`.                                                                                                               |
| Ingredient group           | A bag of ingredients inside a recipe (`recipe_ingredient_groups`). The first group is `isDefault = true` and has no `groupName`.                                                                        |
| Group ingredient           | A row in `group_ingredients(id, groupId, ingredientId, quantity, unitSlug)`.                                                                                                                            |
| Linked recipe / sub-recipe | A row in `recipe_linked_recipes(recipeId, linkedRecipeId, ratio)` declaring that a recipe re-uses another recipe (with a quantity ratio).                                                               |
| Manual tag                 | A tag in `RECIPE_TAGS = ['dessert','mediterranean','chinese','japanese','indian','mexican','italian','french']`, picked by the user in the form.                                                        |
| Auto tag                   | A tag in `AUTO_TAGS = ['vegetarian','magimix']`, computed server-side on every create/update.                                                                                                           |
| `RecipeTag`                | Union of manual and auto tags. Stored mixed in `recipes.tags` (JSON).                                                                                                                                   |
| Magimix program            | A Lexical node representing a Magimix Cook Expert program (program, time, rotation speed, optional temperature). Detected via the substring `"type":"magimixProgram"` in the serialized `instructions`. |
| Subrecipe node             | A Lexical node embedding another recipe's instructions inline, with `hideFirstNodes` / `hideLastNodes` slicing controls.                                                                                |
| Recipe quantity            | A client-only multiplier of the base `servings`, kept per-recipe in the `recipe-quantities` store (TanStack Store).                                                                                     |
| Shopping list membership   | Whether a `recipeId` is currently in the `shopping-list` store (TanStack Store); toggles the `QuantityControls` UI.                                                                                     |

## 3. Requirements, Constraints & Guidelines

### Cross-feature requirements

- **REQ-001** All recipe mutations (create, update, delete) MUST be `createServerFn` instances
  guarded by `authGuard()` middleware and validated with Zod via `parseFormData(formData)`.
- **REQ-002** Update and delete MUST enforce
  `currentRecipe.createdBy === user.id || user.role === 'admin'`. Listing and detail are public.
- **REQ-003** Auto-tag computation is centralized in `crud.spec.md`; the editor feature MUST NOT
  compute tags client-side. The editor's only tag side effect is writing the substring
  `"type":"magimixProgram"` into the serialized instructions JSON.
- **REQ-004** The list query (`getRecipeListOptions`) MUST be invalidated by every recipe mutation
  via `queryKeys.allRecipes` / `queryKeys.recipeLists()`.
- **REQ-005** Recipe routes MUST NOT set public `Cache-Control` headers. They are client-only routes
  (`defaultSsr: false`); the worker emits only a per-request, auth-dependent shell that is not
  publicly cacheable. (R2 asset handlers under `/api/*` keep their own cache headers — see
  `display.spec.md` REQ-004.)

### Constraints

- **CON-001** All foreign keys in `recipe_ingredient_groups`, `group_ingredients`, and
  `recipe_linked_recipes` are `ON DELETE RESTRICT`. The delete server function MUST therefore
  remove children explicitly in a `getDb().batch([...])` before deleting the recipe row.
- **CON-002** Recipe images and videos are stored in R2 keyed by `randomUUID()`. The display layer
  MUST resolve URLs through `getImageUrl`/`getVideoUrl` so that the dev environment substitutes
  picsum placeholders.
- **CON-003** The recipe form is a TanStack React Form, serialized to a `FormData` via
  `objectToFormData` and parsed back with `parseFormData`. Files travel as `File` instances; all
  other fields travel as JSON-stringified values.

### Guidelines

- **GUD-001** Sub-spec files cross-reference each other; do not duplicate detail across them.
- **GUD-002** Type identifiers exported from this feature: `Recipe`, `RecipeIngredientGroup`,
  `ReducedRecipe`, `RecipeTag`, `MagimixProgram`, `MagimixProgramData`, `SubrecipeNodeData`,
  `RecipeFormInput`, `UpdateRecipeFormInput`.

## 4. Interfaces & Data Contracts

### Public API surface (re-exported from sub-modules)

| Symbol                                                                    | Source                                | Purpose                                                                        |
| ------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------ |
| `getAllRecipes`, `getRecipeListOptions`, `ReducedRecipe`                  | `api/get-all.ts`                      | List query for cards and search.                                               |
| `getRecipe`, `getRecipeDetailsOptions`, `Recipe`, `RecipeIngredientGroup` | `api/get-one.ts`                      | Detail query.                                                                  |
| `getRecipeInstructionsOptions`                                            | `api/get-instructions.ts`             | Lazy fetch used by `SubrecipeNode`.                                            |
| `createRecipeOptions`, `recipeSchema`, `RecipeFormInput`                  | `api/create.ts`                       | Create mutation.                                                               |
| `updateRecipeOptions`, `updateRecipeSchema`, `UpdateRecipeFormInput`      | `api/update.ts`                       | Update mutation.                                                               |
| `deleteRecipeOptions`                                                     | `api/delete.ts`                       | Delete mutation.                                                               |
| `RECIPE_TAGS`, `AUTO_TAGS`, `RECIPE_TAG_LABELS`, `RecipeTag`              | `utils/constants.ts`                  | Tag taxonomy.                                                                  |
| `recipeDefaultValues`, `recipeFormFields`                                 | `utils/form.ts`                       | Form initialization.                                                           |
| `recipeNodes`                                                             | `components/editor/extensions.ts`     | Custom Lexical nodes for the editor.                                           |
| `useIsInShoppingList`, `useRecipeQuantities`                              | `hooks/`                              | Display-side scaling and shopping-list integration.                            |
| `LinkedRecipesProvider`, `useLinkedRecipes`                               | `contexts/linked-recipes-context.tsx` | Lets the SubrecipeDialog know which recipe ids are already linked in the form. |

### Database tables owned by this feature

```ts
recipes        (id, name, image, instructions, servings, tags JSON RecipeTag[], video?, createdBy)
recipe_ingredient_groups (id, recipeId FK→recipes ON DELETE RESTRICT, groupName?, isDefault)
group_ingredients (id, groupId FK→recipe_ingredient_groups ON DELETE RESTRICT,
                  ingredientId FK→ingredients ON DELETE RESTRICT, quantity, unitSlug?)
recipe_linked_recipes (recipeId FK→recipes ON DELETE RESTRICT,
                       linkedRecipeId FK→recipes ON DELETE RESTRICT, ratio default 1)
```

## 5. Acceptance Criteria

- **AC-001** A signed-in user can navigate `/ → /recipe/new → /` and see their new card with
  all server-computed auto-tags applied.
- **AC-002** A signed-in owner (or admin) can navigate
  `/recipe/$id → /recipe/edit/$id → back` with the recipe successfully updated and the list
  query invalidated.
- **AC-003** Deleting a recipe removes it and its dependent rows
  (`recipe_ingredient_groups`, `group_ingredients`, `recipe_linked_recipes`) and its R2 image.
- **AC-004** A recipe with at least one Magimix program node in its instructions automatically
  gains the `magimix` tag on save and shows the badge on its card.
- **AC-005** The detail page renders ingredients on the left/desktop or first-tab/mobile, with
  quantities scaled by `useRecipeQuantities`.
- **AC-006** Adding a recipe to the shopping list from a card flips the card footer from
  "Ajouter à la liste de courses" to a `−/+/Supprimer de la liste` control row.

## 6. Test Automation Strategy

- **PAT-001** Server functions (CRUD, get-all, get-one, get-instructions) MUST be tested in
  isolation with mocked `getDb()` and mocked R2 bindings. Verify the `getDb().batch([...])` call
  order in update/delete and verify the auto-tag matrix.
- **PAT-002** Components are tested with React Testing Library, querying via roles/labels (no
  `data-testid`). The Lexical editor and dialogs receive their own focused tests.
- **PAT-003** Each sub-spec lists its own automation patterns (see `crud.spec.md` §6,
  `display.spec.md` §6, `editor.spec.md` §6).

## 7. Rationale & Context

Splitting the spec into one index + three topical sub-specs mirrors the on-disk structure (`api/`,
`components/`, `components/editor/`) and lets each consumer load only what they need. The
auto-tag contract sits in `crud.spec.md` because tags are derived server-side at write-time; the
editor only contributes the _substring marker_ `"type":"magimixProgram"`. Listing and detail are
read-only and stable enough to live together in `display.spec.md`. The Lexical editor is rich and
isolated enough to deserve its own spec.

## 8. Dependencies & External Integrations

- **Cloudflare D1** via Drizzle (`getDb()`); see `docs/infrastructure/data-layer.spec.md`.
- **Cloudflare R2** + Cloudflare Images for image optimization (`env.IMAGES.input(...).transform(...).output(...)`).
- **TanStack Start** server functions and routing (`docs/infrastructure/server-functions.spec.md`,
  `docs/infrastructure/routing-ssr.spec.md`).
- **TanStack React Form** for `RecipeForm`, `MagimixProgramDialog`, `SubrecipeDialog`
  (`docs/infrastructure/forms.spec.md`).
- **Lexical** + `@lexical/react` + `@lexical/utils` for the rich-text editor.
- **TanStack Store** stores: `shopping-list.store`, `recipe-quantities.store`
  (`docs/infrastructure/client-state.spec.md`).
- **Auth feature** (`src/lib/auth/auth-guard.ts`) for write-side authentication.
- **Ingredients feature** (`src/features/ingredients/`) for the ingredient picker and `AddIngredient`
  inline dialog.
- **Shopping list feature** (`src/features/shopping-list/`) consumes recipe ids stored in the
  shopping-list store (TanStack Store).

## 9. Examples & Edge Cases

- **EC-001** A recipe with no own ingredients but a linked recipe whose tags include `vegetarian`:
  auto-tagged `vegetarian` (unless `dessert` is also picked).
- **EC-002** A recipe tagged `dessert` with no meat or fish ingredients: NOT auto-tagged
  `vegetarian` (`dessert` short-circuits the rule).
- **EC-003** Editing a recipe and removing all Magimix nodes: the `magimix` auto-tag is recomputed
  to absent on save.
- **EC-004** Deleting a recipe that is referenced by another recipe via `recipe_linked_recipes`:
  the delete fails because of `ON DELETE RESTRICT` on `linkedRecipeId`. The user must remove the
  link from the parent first.

## 10. Validation Criteria

- All four spec files (this one and the three sub-specs) MUST exist and reference each other in
  their §11.
- The exported types and helpers in §4 MUST match the actual exports in source.
- The DB schema in §4 MUST match `src/lib/db/schema/{recipe,recipe-ingredients,recipe-linked-recipes}.ts`.
- The auto-tag rules MUST be consistent with the implementation in `api/create.ts` and `api/update.ts`.

## 11. Related Specifications / Further Reading

- [./crud.spec.md](./crud.spec.md)
- [./display.spec.md](./display.spec.md)
- [./editor.spec.md](./editor.spec.md)
- [../../../../docs/architecture.spec.md](../../../../docs/architecture.spec.md)
- [../../../../docs/infrastructure/data-layer.spec.md](../../../../docs/infrastructure/data-layer.spec.md)
- [../../../../docs/infrastructure/server-functions.spec.md](../../../../docs/infrastructure/server-functions.spec.md)
- [../../../../docs/infrastructure/forms.spec.md](../../../../docs/infrastructure/forms.spec.md)
- [../../../../docs/infrastructure/routing-ssr.spec.md](../../../../docs/infrastructure/routing-ssr.spec.md)
- [../../shopping-list/shopping-list.spec.md](../../shopping-list/shopping-list.spec.md)
- [../../ingredients/ingredients.spec.md](../../ingredients/ingredients.spec.md)
