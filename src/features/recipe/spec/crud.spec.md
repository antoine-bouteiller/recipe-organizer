---
title: Recipe CRUD & server API
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related: [./index.spec.md]
---

## 2. Problem Statement

The recipe feature needs server-side read and mutation entry points that:

- `[G-1]` Accept multipart FormData for image + video upload in the same request as the recipe payload.
- `[G-2]` Validate the entire recipe shape with a single Zod schema, reused across create + update.
- `[G-3]` Replace ingredient-group + linked-recipe relations atomically on update.
- `[G-4]` Compute auto-tags (`vegetarian`, `magimix`) on every write.
- `[G-5]` Expose typed query-option factories so routes / components can `useQuery(getRecipeDetailsOptions(id))`
  and get correct cache keys for free.
- `[G-6]` Keep reads unauthenticated (list, detail, instructions) so the offline service worker can warm caches
  for all users.

## 3. Key Design Decisions

| Decision                               | Choice                                                                                                                       | Rationale                                                                                                                                    |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Single `recipeSchema`         | Defined in `api/create.ts`, extended to `updateRecipeSchema = recipeSchema.extend({id})`                                     | One source of truth for the recipe form's shape.                                                                                             |
| `[KD-2]` Image field is union          | `z.union([File, { id: string, url: string }])`                                                                               | On create, client sends a `File`. On update, an unchanged image is serialized as `{id, url}` so the server can preserve the existing R2 key. |
| `[KD-3]` Replace-on-update             | Update deletes all `groupIngredient` + `recipeIngredientGroup` + `recipeLinkedRecipes` rows for this recipe, then re-inserts | Simpler than per-row diffing; ingredient groups are cheap and have no incoming FKs. Wrapped in `getDb().batch([...])` for a single D1 trip.  |
| `[KD-4]` Detail read is cache-friendly | `getRecipeDetailsOptions(id)` + `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` on the route           | Recipes rarely change; stale-while-revalidate keeps navigation snappy.                                                                       |
| `[KD-5]` Instructions-only endpoint    | `getRecipeInstructionsOptions(id)` returns `{id, name, instructions}`                                                        | Used by the sub-recipe embed dialog (see editor spec) to preview without fetching the whole tree.                                            |
| `[KD-6]` `withServerError` wrapper     | Applied to list/detail/instructions/update/delete handlers                                                                   | Centralizes error logging + JSON serialization of Errors for the client.                                                                     |
| `[KD-7]` Creator-or-admin check        | Inlined at the top of `update.ts` and `delete.ts` handlers (before any DB write)                                             | Prevents leaking "exists but forbidden" signal since the not-found check happens first, throwing `notFound()` before the permission check.   |

## 4. Principles & Intents

- `[PI-1]` **One FormData parse per handler** — both create and update run
  `recipeSchema.parse(parseFormData(formData))` in their `inputValidator`. Any JSON transformation (arrays,
  numbers) lives in `parseFormData`.
- `[PI-2]` **Atomic writes** — use `getDb().batch([...])` whenever the write consists of more than one statement.
  D1 transactions happen at the batch level.
- `[PI-3]` **Toasts from mutation options** — every `*Options()` factory attaches `onSuccess`/`onError` that emits
  a French toast with the recipe title derived via `getTitle(data)`.
- `[PI-4]` **Query key hygiene** — mutations invalidate the smallest correct bucket:
  - `createRecipeOptions` → `queryKeys.recipeLists()` (home + search lists, not per-id detail).
  - `updateRecipeOptions` → `queryKeys.allRecipes` (list + detail + instructions + by-ids).
  - `deleteRecipeOptions` → `queryKeys.allRecipes`.

## 5. Non-Goals

- `[NG-1]` Partial update (PATCH semantics). Update always sends the full recipe payload.
- `[NG-2]` Bulk create / import endpoints.
- `[NG-3]` Per-field granular permissions.
- `[NG-4]` Server-side pagination. List endpoints return all recipes; volume is small (personal cookbook).

## 6. Caveats

- `[C-1]` `ingredients` inside each group: the client sends `_key` for React keying; it is present in the schema
  but ignored server-side. Keep it — Zod rejects unknown keys in strict mode, and the form relies on it.
- `[C-2]` `unitId` on `groupIngredient` falls back to `undefined` (Drizzle will translate to `NULL`) when the
  form leaves it blank. Any future "required unit" change needs a schema update and a DB backfill.
- `[C-3]` `resolveVideoKey` in `update.ts` has no explicit "clear video" path: `undefined` keeps the current key,
  `File` replaces and deletes the old, `{id, url}` stays pinned. A future "remove video" button must extend this
  function.
- `[C-4]` `delete.ts` calls `deleteFile(currentRecipe.image)` AFTER the DB batch. If R2 fails, the recipe is
  still deleted and the file is orphaned. No retry.
- `[C-5]` `delete.ts` does NOT clean up the video key (`recipe.video`). Videos are orphaned on delete today.

## 7. High-Level Components

| Component            | Module type    | Responsibility                                                                                     | Public API surface                                               |
| -------------------- | -------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Create               | Server fn      | Upload image/video, insert recipe + groups + group-ingredients + linked recipes, compute auto-tags | `createRecipeOptions()`, `recipeSchema`, `RecipeFormInput`       |
| Update               | Server fn      | Load current recipe, validate permission, replace relations, compute auto-tags                     | `updateRecipeOptions()`, `updateRecipeSchema`                    |
| Delete               | Server fn      | Validate permission, batch-delete relations + recipe, remove R2 image                              | `deleteRecipeOptions()`                                          |
| List (home + search) | Server fn      | Return `{id, image, name, servings, tags}[]` for grid rendering                                    | `getRecipeListOptions()`, `getAllRecipes`, `ReducedRecipe`       |
| Detail               | Server fn      | Return recipe + ingredient groups + linked recipes with default group only                         | `getRecipeDetailsOptions(id)`, `Recipe`, `RecipeIngredientGroup` |
| Instructions-only    | Server fn      | Return `{id, name, instructions}` for editor embed dialog                                          | `getRecipeInstructionsOptions(id)`                               |
| Auto-tag helper      | Internal       | `computeAutoTags(categories, linkedTags, instructions, tags) → RecipeTag[]`                        | `update.ts` (also inlined in `create.ts`)                        |
| FormData parser      | Shared utility | Convert FormData entries into typed object expected by Zod                                         | `src/utils/form-data.ts` → `parseFormData`                       |

## 8. Detailed Design

| Component                | Entry point                                                 |
| ------------------------ | ----------------------------------------------------------- |
| Create                   | `src/features/recipe/api/create.ts`                         |
| Update                   | `src/features/recipe/api/update.ts`                         |
| Delete                   | `src/features/recipe/api/delete.ts`                         |
| List                     | `src/features/recipe/api/get-all.ts`                        |
| Detail                   | `src/features/recipe/api/get-one.ts`                        |
| Instructions             | `src/features/recipe/api/get-instructions.ts`               |
| Auto-tag helper          | `src/features/recipe/api/update.ts` → `computeAutoTags`     |
| `getTitle`               | `src/features/recipe/utils/get-recipe-title.ts`             |
| Ingredient select helper | `src/features/recipe/utils/ingredient-group-select.ts`      |
| R2 bindings              | `src/lib/r2.ts` → `uploadFile`, `uploadVideo`, `deleteFile` |

Schema shape (see `api/create.ts` for the authoritative Zod):

```typescript
const recipeSchema = z.object({
  image: z.union([z.instanceof(File), z.object({ id: z.string(), url: z.string() })]),
  video: z.union([z.instanceof(File), z.object({ id: z.string(), url: z.string() })]).optional(),
  name: z.string().min(2),
  servings: z.number().min(0),
  tags: z.array(z.enum(RECIPE_TAGS)), // user-set tags only; auto tags appended server-side
  instructions: z.string(), // Lexical SerializedEditorState as JSON string
  ingredientGroups: z.array(
    z.object({
      _key: z.string(),
      groupName: z.string().optional(),
      ingredients: z.array(
        z.object({
          _key: z.string(),
          id: z.number().min(0),
          quantity: z.number().min(0),
          unitId: z.number().min(0).optional(),
        })
      ),
    })
  ),
  linkedRecipes: z
    .array(
      z.object({
        _key: z.string().optional(),
        id: z.number().min(0),
        ratio: z.number().min(0),
      })
    )
    .optional(),
})
```

## 9. Verification Criteria

- `[VC-1]` Create with a `File` image uploads it via `uploadFile`; the returned key is stored as `recipe.image`.
- `[VC-2]` Create with `{id, url}` image (as would happen on re-submit) skips upload and stores `id` verbatim.
- `[VC-3]` The first ingredient group in the submitted array is inserted with `isDefault = true`; subsequent
  groups get `false`.
- `[VC-4]` Update without a new image file preserves the current R2 key; uploading a new file first calls
  `deleteFile(oldKey)` then `uploadFile(newFile)`.
- `[VC-5]` Update on a recipe the caller did not create, as a non-admin, throws `Permission denied`.
- `[VC-6]` Update on a non-existent recipe throws `notFound()`.
- `[VC-7]` Delete cascades through `groupIngredient`, `recipeIngredientGroup`, `recipeLinkedRecipes`, then
  `recipe`, all inside a single `batch`.
- `[VC-8]` Delete removes the image from R2 (`deleteFile`).
- `[VC-9]` `getRecipeListOptions` ordering is by `name ASC`.
- `[VC-10]` `getRecipeDetailsOptions` returns ingredient groups ordered by `isDefault DESC` and only the default
  group of each linked recipe.
- `[VC-11]` Auto-tag rules:
  - vegetarian: ALL own ingredients are non-meat/non-fish AND all linked recipes include `vegetarian` AND the
    form did not include `dessert` → `vegetarian` appended.
  - magimix: `instructions.includes('"types":"magimixProgram"')` → `magimix` appended.
- `[VC-12]` Success/failure toasts include the recipe title and are in French.
- `[VC-13]` Lint + typecheck pass.

## 10. Open Questions

- `[OQ-1]` Should delete also call `deleteFile(video)`?
- `[OQ-2]` Should we Zod-validate `instructions` is parseable Lexical JSON rather than `z.string()`?
