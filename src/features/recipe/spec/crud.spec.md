---
title: Recipe Feature - CRUD (Create / Update / Delete)
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [feature, recipe, crud, server-functions, r2, auto-tags]
---

# Introduction

This spec covers the write-side of the recipe feature: the `createRecipe`, `updateRecipe`, and
`deleteRecipe` server functions, the form-data parsing pipeline, the R2 image/video upload
contract, the auto-tag computation (vegetarian, magimix), and the batched relational delete
strategy that satisfies the `ON DELETE RESTRICT` foreign keys.

Source files:

- `src/features/recipe/api/create.ts`
- `src/features/recipe/api/update.ts`
- `src/features/recipe/api/delete.ts`
- `src/features/recipe/utils/{constants,form,get-recipe-title}.ts`
- `src/lib/r2.ts`
- `src/routes/recipe/{new,edit.$id}.tsx`

## 1. Purpose & Scope

### Purpose

Provide a single, authoritative server-side write path for recipes that:

- enforces authentication and ownership;
- validates form-data input with Zod;
- uploads images via Cloudflare Images and videos as raw bytes to R2;
- computes auto-tags from the persisted graph (own ingredients, linked recipes, instructions);
- persists changes with a `getDb().batch([...])` so partial writes can't leave dangling rows.

### Out of scope

- Reading recipes (see [display.spec.md](./display.spec.md)).
- The Lexical editor that produces the `instructions` JSON string (see [editor.spec.md](./editor.spec.md)).
- The R2 GET/HEAD handlers used at read-time (see [display.spec.md](./display.spec.md)).

## 2. Definitions

| Term                      | Meaning                                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `recipeSchema`            | Zod schema in `api/create.ts` for the full create input. Re-used by update via `.extend({ id })`.                                      |
| `parseFormData(formData)` | Helper from `@/utils/form-data` that turns the multipart body into a JS object, preserving `File` instances and JSON-parsing the rest. |
| `objectToFormData(value)` | Inverse helper used on the client to serialize the form before submitting.                                                             |
| `authGuard()`             | Middleware from `src/features/auth/lib/auth-guard.ts` that injects `context.user`.                                                     |
| `withServerError(fn)`     | Wrapper from `@/utils/error-handler` that translates thrown errors into typed server-fn errors.                                        |
| Auto-tag                  | Server-computed entry in `recipes.tags`. Two are emitted: `vegetarian` and `magimix`.                                                  |
| Image key / Video key     | Opaque `randomUUID()` string used as the R2 object key and stored in `recipes.image` / `recipes.video`.                                |

## 3. Requirements, Constraints & Guidelines

### Requirements

- **REQ-001** `createRecipe` is `POST` + `authGuard()` + `validator(formData =>
recipeSchema.parse(parseFormData(formData)))`. It MUST set `recipes.createdBy = context.user.id`.
- **REQ-002** `updateRecipe` re-uses `recipeSchema.extend({ id: z.number() })` and MUST throw
  `notFound()` if the row doesn't exist, then throw `'Permission denied'` unless
  `context.user.role === 'admin' || currentRecipe.createdBy === context.user.id`.
- **REQ-003** `deleteRecipe` accepts `z.number()` (the recipe id) and applies the same ownership
  rule as `updateRecipe`.
- **REQ-004** `recipeSchema` MUST validate:

  ```ts
  {
    image: File | { id: string; url: string },
    ingredientGroups: Array<{
      _key: string,
      groupName?: string,
      ingredients: Array<{ _key: string; id: number ≥ 0; quantity: number ≥ 0; unitSlug?: UnitSlug }>
    }>,
    instructions: string,
    linkedRecipes?: Array<{ _key?: string; id: number ≥ 0; ratio: number ≥ 0 }>,
    name: string (≥ 2 chars),
    servings: number ≥ 0,
    tags: Array<RECIPE_TAGS[number]>,
    video?: File | { id: string; url: string }
  }
  ```

- **REQ-005** Image upload pipeline (`uploadFile` in `src/lib/r2.ts`) MUST optimize the source
  image with `env.IMAGES.input(stream).transform({ width: 1024 }).output({ format: 'image/webp',
quality: 80 })`, copy the response to an `ArrayBuffer`, and `R2_BUCKET.put(key, buffer, {
httpMetadata: { contentType: optimizedImage.contentType() } })` where `key = randomUUID()`.
- **REQ-006** Video upload (`uploadVideo`) MUST upload raw bytes (`file.arrayBuffer()`) with
  `httpMetadata.contentType = file.type`. No transformation.
- **REQ-007** When `image` is a `File` and there is a previous image key, update MUST `deleteFile`
  the old key before uploading the new one. Same rule for `video`. When `video === undefined` on
  update, the existing key is preserved (intentional semantic to allow keeping video unchanged).
- **REQ-008** Auto-tag rules executed server-side after the `Promise.all` resolves the
  ingredient categories and linked-recipe tags:
  - `vegetarian` is added IFF
    `ingredientCategories.every(c.category !== 'meat' && c.category !== 'fish')`
    AND `linkedRecipesData.every(r.tags?.includes('vegetarian'))`
    AND `!tags.includes('dessert')`.
  - `magimix` is added IFF `instructions.includes('"type":"magimixProgram"')`.
- **REQ-009** The update batch MUST execute these statements atomically, in this order:
  1. `update(recipe).set(...).where(eq(recipe.id, id)).returning(...)`,
  2. `delete(groupIngredient).where(inArray(groupIngredient.groupId, currentRecipe.ingredientGroups.map(...)))`,
  3. `delete(recipeIngredientGroup).where(eq(recipeIngredientGroup.recipeId, id))`,
  4. `delete(recipeLinkedRecipes).where(eq(recipeLinkedRecipes.recipeId, id))`.
     Then re-insert ingredient groups via `Promise.all` (one insert per group, then bulk-insert its
     ingredients), then bulk-insert `recipeLinkedRecipes` if `isNotEmpty(linkedRecipes)`.
- **REQ-010** The delete batch MUST execute, in this order:
  `delete(groupIngredient) → delete(recipeIngredientGroup) → delete(recipeLinkedRecipes) →
delete(recipe)`. After the batch resolves, `deleteFile(currentRecipe.image)` is called. The
  video key is currently NOT cleaned up on delete (TODO: track in backlog).
- **REQ-011** All three mutations invalidate the recipe list query through their
  `mutationOptions.onSuccess`:
  - create: `invalidateQueries({ queryKey: queryKeys.recipeLists() })`,
  - update: `invalidateQueries({ queryKey: queryKeys.allRecipes })`,
  - delete: `invalidateQueries({ queryKey: queryKeys.allRecipes })`.

### Constraints

- **CON-001** Foreign keys in `recipe_ingredient_groups`, `group_ingredients`, and
  `recipe_linked_recipes` are `ON DELETE RESTRICT`. Without the explicit batch deletes the
  recipe row cannot be removed.
- **CON-002** Drizzle's `getDb().batch([...])` is the only construct that gives D1
  multi-statement atomicity.
- **CON-003** The first ingredient group is implicitly the "default" group and is persisted with
  `isDefault: true`. Subsequent groups are `isDefault: false`. The form does not surface the flag.
- **CON-004** Image optimization with `env.IMAGES.input(...)` requires R2 to receive a
  known-length body, hence the `arrayBuffer()` round-trip.

### Guidelines

- **GUD-001** When auto-tag inputs are partially absent (no own ingredients OR no linked recipes),
  the corresponding "vegetarian" sub-condition defaults to `true`. See `api/create.ts` for the
  three-branch optimization that skips the empty-set query.
- **GUD-002** The form's `_key` random keys exist purely for React stable list keys; the schema
  accepts but otherwise ignores them.
- **GUD-003** Always extend `recipeSchema` rather than re-declaring fields in `update.ts`.

## 4. Interfaces & Data Contracts

### Server functions

```ts
const createRecipe = createServerFn()
  .middleware([authGuard()])
  .validator((formData: FormData) => recipeSchema.parse(parseFormData(formData)))
  .handler(async ({ data, context }) => {
    /* ... */
  })

const updateRecipe = createServerFn()
  .middleware([authGuard()])
  .validator((formData: FormData) => updateRecipeSchema.parse(parseFormData(formData)))
  .handler(
    withServerError(async ({ data, context }) => {
      /* ... returns id */
    })
  )

const deleteRecipe = createServerFn()
  .middleware([authGuard()])
  .validator(z.number())
  .handler(
    withServerError(async ({ data: id, context }) => {
      /* ... */
    })
  )
```

### Mutation options

```ts
createRecipeOptions(): MutationOptions  // success: invalidate queryKeys.recipeLists() + toast
updateRecipeOptions(): MutationOptions  // success: invalidate queryKeys.allRecipes + toast
deleteRecipeOptions(): MutationOptions  // success: invalidate queryKeys.allRecipes
```

### R2 helpers (`src/lib/r2.ts`)

```ts
uploadFile(file: File): Promise<string>     // image key (Cloudflare Images optimized → webp)
uploadVideo(file: File): Promise<string>    // video key (raw bytes)
deleteFile(key: string): Promise<void>
```

### Form-data round-trip

- Client (`src/routes/recipe/{new,edit.$id}.tsx`):
  `objectToFormData(value)` → POST.
- Server (`api/{create,update}.ts`):
  `recipeSchema.parse(parseFormData(formData))`.

## 5. Acceptance Criteria

- **AC-001** Posting `createRecipe` without a session yields a 401-equivalent server error from
  `authGuard()`.
- **AC-002** Posting `createRecipe` with a 1-character `name` rejects with a Zod validation error.
- **AC-003** A successful `createRecipe` writes one `recipes` row, one `recipe_ingredient_groups`
  row per group with `isDefault: true` only on index 0, one `group_ingredients` row per
  ingredient, and one `recipe_linked_recipes` row per linked recipe.
- **AC-004** A successful `createRecipe` with all-vegetable ingredients and no `dessert` tag
  persists `tags: [...userTags, 'vegetarian']`.
- **AC-005** A successful `createRecipe` whose `instructions` contains the literal substring
  `"type":"magimixProgram"` persists `tags` including `'magimix'`.
- **AC-006** `updateRecipe` invoked by a non-owner non-admin throws `'Permission denied'` and
  performs no writes.
- **AC-007** `updateRecipe` with `image` as a `{ id, url }` object preserves the existing
  `recipes.image` value and does NOT call `deleteFile`.
- **AC-008** `updateRecipe` replaces the entire ingredient/linked-recipe graph: the four
  delete/update statements execute in a single `batch`.
- **AC-009** `deleteRecipe` invoked on a non-existent id throws `'Recipe not found'`.
- **AC-010** `deleteRecipe` removes children before the parent and calls
  `deleteFile(currentRecipe.image)`.

## 6. Test Automation Strategy

- **PAT-001** Unit-test `recipeSchema` and `updateRecipeSchema` on representative valid and invalid
  payloads (short name, negative quantity, unknown tag, malformed unit).
- **PAT-002** Mock `getDb()` to assert the exact `batch([...])` argument shape and order in update
  and delete handlers. Mock `env.R2_BUCKET` and `env.IMAGES` to verify upload pipelines.
- **PAT-003** Cover the auto-tag matrix:

  | own ingredients | linked recipes           | dessert? | magimix? | expected auto-tags                            |
  | --------------- | ------------------------ | -------- | -------- | --------------------------------------------- |
  | none            | none                     | no       | no       | `[]` (vegetarian short-circuits true)         |
  | all veg         | all `vegetarian`         | no       | no       | `['vegetarian']`                              |
  | all veg         | all `vegetarian`         | yes      | no       | `[]`                                          |
  | meat present    | any                      | no       | no       | `[]`                                          |
  | any             | one missing `vegetarian` | no       | no       | `[]`                                          |
  | any             | any                      | no       | yes      | `['magimix']` (or `['vegetarian','magimix']`) |

- **PAT-004** Verify that ownership checks fire BEFORE any `deleteFile`/`uploadFile` call in
  update.

## 7. Rationale & Context

- **Why batch deletes instead of `ON DELETE CASCADE`?** D1 enforces FK constraints; cascade
  semantics across child tables are simulated explicitly so we can audit the order and reason
  about partial failures.
- **Why image optimization to webp/1024?** The shopping app's hero card needs to look acceptable
  on mobile data. 1024px wide @ webp/q80 gives a ~5–10× size reduction over the original upload.
- **Why store `instructions` as a JSON string?** Lexical's serialized state is a JSON tree; we
  persist it verbatim to round-trip exactly. The substring marker `"type":"magimixProgram"`
  intentionally piggy-backs on this serialization to avoid a separate scan pass.
- **Why drop the entire ingredient/linked graph on update?** The form is the source of truth and
  diffing structured rows against the current DB state would be more code than a batched replace,
  with no real performance benefit at our row counts.

## 8. Dependencies & External Integrations

- **`authGuard()`** middleware from the auth feature.
- **`@/lib/db`** Drizzle client (`getDb()`), schema modules, and the `batch` API.
- **`env.IMAGES`** Cloudflare Images binding for transformations.
- **`env.R2_BUCKET`** Cloudflare R2 binding.
- **`@/utils/form-data`** for `parseFormData` / `objectToFormData`.
- **`@/utils/error-handler`** for `withServerError`.
- **`zod`** for input validation.
- **`@tanstack/react-query`** for `mutationOptions` and the invalidation contract.
- **`@/components/common/toast`** + **`@/lib/toast-helpers`** for user feedback (`toastError`, success
  toasts on create/update).

## 9. Examples & Edge Cases

- **EC-001** All-vegetable recipe tagged `dessert`: stored tags = `['dessert']`, no auto
  `vegetarian`.
- **EC-002** Recipe with one Magimix step but a meat ingredient: stored tags include `'magimix'`
  but NOT `'vegetarian'`.
- **EC-003** Update with `video: undefined` (field omitted from `FormData`): `recipes.video`
  unchanged. Update with `video: null`-equivalent (not currently possible from the form): would
  set `recipes.video = null`. Update with `video` as `{ id, url }`: stores `id`. Update with
  `video` as a `File`: deletes old key (if any) and uploads the new one.
- **EC-004** Deleting a recipe whose id is referenced by another recipe via
  `recipe_linked_recipes.linkedRecipeId`: the final
  `delete(recipe).where(eq(recipe.id, id))` fails with a FK error because the parent's
  `recipe_linked_recipes` row still references this id. Resolution: remove the link from the
  parent recipe first.
- **EC-005** A linked recipe's id 0/-1 (placeholder from the form): `z.number().min(0)` rejects
  -1 and `id: 0` would reach the DB. The form initializes new linked rows with `id: -1`, so
  validation forces the user to pick a real recipe before submit.
- **EC-006** A `File` upload smaller than 1024px: Cloudflare Images still re-encodes to webp/q80;
  the resulting key is independent of the source format.

## 10. Validation Criteria

- The Zod schema in source MUST match §3 REQ-004.
- The `getDb().batch([...])` call sites in `api/update.ts` and `api/delete.ts` MUST match the
  ordering in REQ-009 and REQ-010.
- The auto-tag function `computeAutoTags` (update) and the inline computation (create) MUST
  produce identical outputs for identical inputs.
- The mutation options `onSuccess` callbacks MUST invalidate the keys listed in REQ-011.

## 11. Related Specifications / Further Reading

- [./index.spec.md](./index.spec.md)
- [./display.spec.md](./display.spec.md) — read-side counterpart; explains how the persisted graph
  is consumed.
- [./editor.spec.md](./editor.spec.md) — defines the editor side of the auto-magimix contract
  (the `"type":"magimixProgram"` substring marker).
- [../../../../docs/architecture.spec.md](../../../../docs/architecture.spec.md)
- [../../../../docs/infrastructure/data-layer.spec.md](../../../../docs/infrastructure/data-layer.spec.md)
- [../../../../docs/infrastructure/server-functions.spec.md](../../../../docs/infrastructure/server-functions.spec.md)
- [../../../../docs/infrastructure/forms.spec.md](../../../../docs/infrastructure/forms.spec.md)
- [../../../../docs/infrastructure/routing-ssr.spec.md](../../../../docs/infrastructure/routing-ssr.spec.md)
- [../../shopping-list/shopping-list.spec.md](../../shopping-list/shopping-list.spec.md)
- [../../ingredients/ingredients.spec.md](../../ingredients/ingredients.spec.md)
