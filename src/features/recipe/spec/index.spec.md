---
title: Recipe (index)
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related:
  - ./crud.spec.md
  - ./editor.spec.md
  - ./display.spec.md
  - ../../ingredients/ingredients.spec.md
  - ../../shopping-list/shopping-list.spec.md
  - ../../../../docs/specs/unit.spec.md
---

## 2. Problem Statement

Recipes are the central artifact of the app. A recipe is more than a blob of markdown — it must carry structured
ingredients (so shopping lists can aggregate), structured sub-recipe links (so a "pizza" can reuse "dough"), rich
text for instructions (so users can embed Magimix programs and cross-references), and media (image required,
video optional).

- `[G-1]` Authenticated users can create, read, update, and delete recipes.
- `[G-2]` A recipe's ingredients are grouped ("for the dough" / "for the sauce") and each line has a typed
  ingredient, quantity, and optional unit.
- `[G-3]` A recipe can link to other recipes as sub-components, with a ratio (e.g., "use 0.5× of the pizza dough
  recipe"). Sub-recipe ingredients flow through to the shopping list.
- `[G-4]` Instructions are a Lexical rich-text document (migrated from Tiptap in Apr 2026) with custom decorator
  nodes for Magimix programs and sub-recipe insertions.
- `[G-5]` The app auto-derives `vegetarian` and `magimix` tags from structured data on every create/update, so
  users don't have to tag manually.
- `[G-6]` The recipe detail page lets users scale ingredient quantities live (via a client-side per-recipe
  servings override) without mutating the recipe.
- `[G-7]` The recipe list / detail pages use HTTP cache headers + TanStack Query for fast repeat loads, since
  recipes rarely change.

## 3. Key Design Decisions

| Decision                                                | Choice                                                                                                                                                                                                                         | Rationale                                                                                                                               |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Structured ingredients                         | 3-table model: `recipe` → `recipe_ingredient_groups` → `group_ingredients`                                                                                                                                                     | Enables groupings + shopping-list aggregation without HTML parsing.                                                                     |
| `[KD-2]` Auto-tag derivation                            | Server-side computation on every `create`/`update`: `vegetarian` if no meat/fish ingredients (and no meat/fish in linked recipes) and not tagged `dessert`; `magimix` if instructions JSON contains `"types":"magimixProgram"` | Keeps tags accurate as content changes; `dessert` exclusion avoids mis-tagging sweet recipes that happen to have no meat.               |
| `[KD-3]` Linked recipes with ratio                      | `recipe_linked_recipes(recipeId, linkedRecipeId, ratio)`                                                                                                                                                                       | "This recipe uses half of the dough recipe" is a common pattern; a single float ratio is simpler than re-entering ingredients.          |
| `[KD-4]` Instructions as Lexical JSON                   | Column `instructions text` stores `SerializedEditorState` JSON (migrated from HTML Apr 2026)                                                                                                                                   | Lexical supports typed decorator nodes (Magimix program, sub-recipe embed) and clean SSR; the `magimix` auto-tag greps the JSON string. |
| `[KD-5]` FormData, not JSON, for submit                 | `inputValidator((formData: FormData) => recipeSchema.parse(parseFormData(formData)))`                                                                                                                                          | Image + video uploads require multipart; the rest of the form hitches a ride on the same request.                                       |
| `[KD-6]` Update = replace                               | Update wipes all `recipe_ingredient_groups` + `group_ingredients` + `recipe_linked_recipes` and re-inserts                                                                                                                     | Simpler than diffing; ingredient groups don't have stable IDs the UI can trust across edits.                                            |
| `[KD-7]` Creator-or-admin for mutations                 | `update` + `delete` check `recipe.createdBy === userId` OR `role === 'admin'`                                                                                                                                                  | Prevents a user from editing another user's recipe; admin override for moderation.                                                      |
| `[KD-8]` Live scaling is client-side                    | `useRecipeQuantitiesStore` (Zustand + persist) holds `{recipeId → servings}` per browser                                                                                                                                       | Scaling is a personal preference ("I'm cooking for 4 tonight"), not a recipe edit.                                                      |
| `[KD-9]` Detail page is cacheable                       | `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` on `GET /recipe/$id`                                                                                                                                     | Recipes change rarely; aggressive caching is safe, invalidation happens via TanStack Query on mutation.                                 |
| `[KD-10]` Variant collapsing in shopping list, not here | The shopping-list feature collapses cherry-tomato into tomato                                                                                                                                                                  | Keeps the recipe feature focused on authoring; aggregation logic is downstream.                                                         |

## 4. Principles & Intents

- `[PI-1]` **Structured > free-form** — anything the shopping list needs to reason about (ingredients, sub-recipes)
  lives in typed tables, never in free text.
- `[PI-2]` **Auto-tags are derived, not stored-by-user** — users can add cuisine tags (`french`, `italian`, ...),
  but `vegetarian` and `magimix` are overwritten every write. See `constants.ts` → `AUTO_TAGS`.
- `[PI-3]` **Media deletion is the server's responsibility** — when update replaces an image or delete removes a
  recipe, the server calls `deleteFile(...)` on R2. Orphaned R2 objects are a bug.
- `[PI-4]` **Creator-or-admin, at the server** — UI hides actions for non-creators, but the server re-validates.
  The UI is not the source of truth for permissions.
- `[PI-5]` **Lexical JSON is opaque to almost everything** — the only server-side inspection is a substring
  search for `"types":"magimixProgram"`. No HTML parsing, no schema validation of the JSON beyond Zod
  `z.string()`.

## 5. Non-Goals

- `[NG-1]` Recipe versioning / edit history.
- `[NG-2]` Recipe sharing or publication outside the single tenant (see auth `[NG-3]`).
- `[NG-3]` Ingredient quantity arithmetic on the server (unit conversion, density, etc.) — display uses raw
  stored values.
- `[NG-4]` Server-side full-text search — the search page filters a client-side list of lightweight recipe rows.
- `[NG-5]` Tagging beyond the fixed `RECIPE_TAGS` + `AUTO_TAGS` sets.
- `[NG-6]` Offline authoring (create/edit while offline). Read via service worker is fine.

## 6. Caveats

- `[C-1]` Update always deletes + re-inserts all ingredient groups (see `[KD-6]`). Any future per-row ID
  references by other tables would break.
- `[C-2]` The `magimix` auto-tag uses a raw `includes('"types":"magimixProgram"')` string match on the Lexical
  JSON. Renaming the decorator node's `type` field (e.g., switching from `types` to `type`) breaks this
  detection silently. See caveat in editor spec.
- `[C-3]` The `vegetarian` auto-tag treats a recipe with zero ingredients AND zero linked recipes as vegetarian
  (vacuous truth). Unlikely in practice but worth noting.
- `[C-4]` `recipe.createdBy` has a DB default of `'1'` and no FK to `user.id`. Pre-existing rows may reference
  users who no longer exist. Do not rely on this column as a strong FK.
- `[C-5]` `recipe.tags` is stored as JSON in a text column (`{ mode: 'json' }`). Drizzle types it as
  `RecipeTag[]` but nothing enforces the set at the DB level — a bad write could store arbitrary strings.
- `[C-6]` R2 cleanup on delete is best-effort: if `deleteFile` fails after the DB batch succeeds, the object is
  orphaned. No retry today.
- `[C-7]` Video is optional and deletable — `resolveVideoKey` in `update.ts` treats `video === undefined` as
  "keep current", whereas a new `File` replaces and deletes the old one. There is no "explicit clear" path from
  the form today.

## 7. High-Level Components

| Component           | Module type          | Responsibility                                                                         | Public API surface                                                                                                                                     |
| ------------------- | -------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Recipe CRUD         | Server functions     | Create / update / delete / list / detail / instructions-only                           | `createRecipeOptions`, `updateRecipeOptions`, `deleteRecipeOptions`, `getRecipeListOptions`, `getRecipeDetailsOptions`, `getRecipeInstructionsOptions` |
| Recipe form         | React                | Reusable create + edit form (`withForm`), with ingredient-group + linked-recipe arrays | `<RecipeForm />`, `recipeSchema`, `updateRecipeSchema`                                                                                                 |
| Rich-text editor    | React                | Lexical editor with Magimix + Subrecipe decorator nodes, shared readonly render        | `recipeNodes`, `<MagimixProgramNode>`, `<SubrecipeNode>`, `<MagimixProgramButton>`, `<SubrecipeButton>`                                                |
| Detail page         | Route                | Render recipe with ingredient groups + instructions + live scaling + edit/delete menu  | `GET /recipe/$id`                                                                                                                                      |
| Edit / New pages    | Routes               | Pre-filled form (edit) / empty form (new); submit via FormData                         | `POST /recipe/new`, `POST /recipe/edit/$id`                                                                                                            |
| Home / Search pages | Routes               | Grid of recipe cards and free-text filter UI                                           | `GET /`, `GET /search`                                                                                                                                 |
| Client scaling      | Hook + Zustand store | Per-recipe persisted "desired servings" override used on detail page + shopping list   | `useRecipeQuantities(recipeId, base)`, `useRecipeQuantitiesStore`                                                                                      |
| Auto-tag logic      | Server helpers       | `computeAutoTags(...)` + inline computation in `create.ts`                             | Internal to `api/create.ts`, `api/update.ts`                                                                                                           |

Detailed per-component specs:

- [CRUD + server API](./crud.spec.md)
- [Editor (Lexical) + decorator nodes](./editor.spec.md)
- [Display + scaling + list / search / detail UI](./display.spec.md)

## 8. Detailed Design

See component specs in this directory. Cross-cutting entry points:

| Concern                      | Entry point                                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DB schema                    | `src/lib/db/schema/recipe.ts`, `src/lib/db/schema/recipe-ingredients.ts`, `src/lib/db/schema/recipe-linked-recipes.ts`                                  |
| Query keys                   | `src/lib/query-keys.ts` → `queryKeys.recipeList()`, `recipeDetail(id)`, `recipeInstructions(id)`, `recipeListByIds(ids)`, `allRecipes`, `recipeLists()` |
| Tag taxonomy                 | `src/features/recipe/utils/constants.ts` → `RECIPE_TAGS`, `AUTO_TAGS`, `RECIPE_TAG_LABELS`                                                              |
| Form defaults                | `src/features/recipe/utils/form.ts`                                                                                                                     |
| Ingredient-group read helper | `src/features/recipe/utils/ingredient-group-select.ts`                                                                                                  |

## 9. Verification Criteria

Per-component VCs live in the component specs. Cross-cutting checks:

- `[VC-1]` Every server function in `src/features/recipe/api/` applies `authGuard()` unless it is intentionally
  public read (list + detail + instructions are public reads; CRUD is auth-gated).
- `[VC-2]` `updateRecipe` and `deleteRecipe` throw `Permission denied` for a non-admin whose `userId` does not
  match `recipe.createdBy`.
- `[VC-3]` After any recipe mutation, at minimum `queryKeys.allRecipes` (or `recipeLists()` for `create`) is
  invalidated so the home / search / detail views reflect the change.
- `[VC-4]` Auto-tag computation: given a recipe with at least one `meat`/`fish` ingredient, the result does NOT
  include `vegetarian`; given instructions JSON containing `"types":"magimixProgram"`, the result includes
  `magimix`.
- `[VC-5]` The `dessert`-tagged recipe with all-veg ingredients is NOT auto-tagged `vegetarian` (see `[KD-2]`).
- `[VC-6]` `bun lint` / `bun typecheck` / `bun test` pass.

## 10. Open Questions

- `[OQ-1]` Should we diff ingredient groups on update instead of wipe-and-insert? Only if some future feature
  pins identity to `group.id` across edits.
- `[OQ-2]` Should `magimix` detection move from string-match on JSON to a Lexical traversal? Cheaper today but
  fragile; see `[C-2]`.
- `[OQ-3]` Should `recipe.createdBy` gain a FK to `user.id` with `ON DELETE SET NULL`? Currently blocked by the
  "never hard-delete users" policy, but the FK would be sound either way.
