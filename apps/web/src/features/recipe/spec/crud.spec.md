---
title: Recipe CRUD
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: apps/web/src/features/recipe/spec/index.spec.md
related: [docs/infrastructure/server/data-layer.spec.md, docs/infrastructure/server/server-functions.spec.md]
---

## Why

A recipe form submission must become a valid, authorized aggregate before anything reaches R2 or D1.
This leaf owns that server-side write boundary — validation, ownership, derived flags, media, and
the relational ingredient, link, and step graph — serving `index.spec.md` [G-1] and [G-4].

- `[NG-1]` Editing individual ingredient, link, or step rows outside a recipe submission.
- `[NG-2]` Direct browser access to R2 write bindings.
- `[NG-3]` Deriving recipe flags in the editor or display layer.

## Design

- `[PI-1]` **Validation gates effects** — malformed data does not reach R2 or D1.
- `[PI-2]` **Ownership protects every mutation** — only an owner or admin can alter or remove a
  recipe, refining `index.spec.md` [PI-1].
- `[PI-3]` **Graph writes are cohesive** — ingredient groups, ingredients, recipe links, and steps
  describe one submitted recipe.

| Decision                       | Choice                                                                                                                                       | Rationale                                                                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Validation boundary   | Create and update accept `FormData`, parse it into typed values, and validate it inside guarded API routes.                                  | Multipart files and structured fields reach one trust boundary that gates storage effects.                                                         |
| `[KD-2]` Aggregate replacement | Update removes the recipe's outgoing graph rows — ingredient groups, ingredients, links, and steps — and writes the submitted graph.         | The submitted form is the complete aggregate, avoiding an error-prone row-level diff.                                                              |
| `[KD-3]` Derived flags         | The write path derives `isVegetarian`, `isSpice`, and `isMagimix`; `isMagimix` is true when any submitted step has `kind: 'magimix'`.        | Durable flags stay consistent with the graph; a typed step replaces the former `"type":"magimixProgram"` string marker.                            |
| `[KD-4]` Media lifecycle       | Images pass through a transform into R2; videos retain uploaded bytes; stale keys use best-effort deletion.                                  | Images have a bounded delivery format while media-cleanup failure does not invalidate a committed recipe.                                          |
| `[KD-5]` Sub-recipe integrity  | A `subrecipe` step's `recipeId` must be one of the submitted linked-recipe ids and differ from the recipe's own id; otherwise 400.           | The step reference stays a view onto a declared relation, and the server no longer trusts the picker.                                              |
| `[KD-6]` Table per step kind   | Steps persist in `text_steps`, `magimix_steps`, and `subrecipe_steps`, each sharing `recipe_id` and `position` with only its kind's columns. | Required fields are `NOT NULL` instead of nullable columns guarded by CHECKs; a new kind adds a table, and `subrecipe_id` gets a real foreign key. |

## Outcome

- `[SO-1]` Create and update persist a recipe's ordered steps as typed rows in the three step tables
  inside the same aggregate write as its ingredients and links. — demonstrated by `[VC-1]`, `[VC-2]`
- `[SO-2]` The database and the write boundary reject inconsistent steps: a missing required field
  for a kind, or a sub-recipe outside the recipe's linked recipes. — demonstrated by `[VC-3]`, `[VC-4]`
- `[SO-3]` `isMagimix` follows the presence of a Magimix step. — demonstrated by `[VC-5]`
- `[SO-4]` Mutations stay owner-or-admin guarded, and malformed input causes no storage effect. —
  demonstrated by `[VC-6]`

## Contracts

### `[CT-1]` Step persistence

```ts
// apps/api/db/schema/recipe-steps.ts
const stepBase = () => ({
  id: integer('id').primaryKey(),
  recipeId: integer('recipe_id')
    .notNull()
    .references(() => recipe.id, { onDelete: 'restrict' }),
  position: integer('position').notNull(), // 1-based, contiguous per recipe across all step tables
})

export const textSteps = sqliteTable('text_steps', { ...stepBase(), text: text('text').notNull() }, (t) => [
  uniqueIndex('uq_text_steps_recipe_position').on(t.recipeId, t.position),
])

export const magimixSteps = sqliteTable(
  'magimix_steps',
  {
    ...stepBase(),
    program: text('program').$type<MagimixProgram>().notNull(),
    rotationSpeed: text('rotation_speed').$type<RotationSpeed>().notNull(),
    time: integer('time').notNull(),
    temperature: integer('temperature'),
  },
  (t) => [uniqueIndex('uq_magimix_steps_recipe_position').on(t.recipeId, t.position)]
)

export const subrecipeSteps = sqliteTable(
  'subrecipe_steps',
  {
    ...stepBase(),
    subrecipeId: integer('subrecipe_id')
      .notNull()
      .references(() => recipe.id, { onDelete: 'restrict' }),
    fromStep: integer('from_step'),
    toStep: integer('to_step'),
  },
  (t) => [uniqueIndex('uq_subrecipe_steps_recipe_position').on(t.recipeId, t.position), index('idx_subrecipe_steps_subrecipe_id').on(t.subrecipeId)]
)
```

- The table is the kind: no discriminator column, and `NOT NULL` replaces CHECK constraints.
- Row ↔ `RecipeStep` (`editor.spec.md` [CT-1]) mapping is one pure pair of functions per table,
  shared by the write path and the read projections.
- **Write:** the submitted array is split by `kind`; each step keeps its 1-based array index as
  `position`, so positions are unique and contiguous across the three tables by construction.
- **Read:** the three tables are queried by `recipe_id` in one D1 batch and merged by `position`.
- Optional fields (`temperature`, `fromStep`, `toStep`) are `NULL` when absent. Program and speed
  enums are validated by Zod, not by the database.

### `[CT-2]` Aggregate shape and write flow

```text
recipe
├── ingredientGroups[] └── ingredients[] { ingredientId, quantity, unitSlug? }
├── linkedRecipes[] { recipeId, ratio }
├── steps[] RecipeStep                 ← replaces `instructions: Lexical JSON`
├── image key
└── video key?

FormData → guarded validator ([KD-5] check) → ownership lookup → media keys + derived flags
         → D1 recipe + graph writes → query invalidation + French feedback
```

- **Input:** the parser preserves `File` values for media and decodes JSON fields, including
  `steps`. A valid image is a file or an already-held media reference; video is optional likewise.
  Ingredient entries pair a non-negative ingredient id and quantity with an optional unit; linked
  recipes pair a non-negative target id with a non-negative ratio; steps satisfy `recipeStepSchema`.
- **Create** binds `createdBy` to the authenticated user, writes the recipe row, then the graph; a
  graph error compensates by deleting the new recipe (and any rows written under it).
- **Update** loads the recipe and requires owner or admin, then batches removal of group ingredients,
  ingredient groups, outgoing links, and steps before writing the submitted graph.
- **Delete** requires owner or admin, batches child removal (steps included) ahead of the recipe row,
  then attempts image deletion.
- **Failure:** a missing target is not-found; an unauthorized target or a schema / [KD-5] violation
  produces no media or database effect. Mutation options map failures to French feedback.
- **Referential guard:** a recipe referenced by another recipe's link or `subrecipe_id` cannot be
  deleted (restrict FKs); since [KD-5] requires a link for every sub-recipe step, the link is the
  user-visible reason.

### `[CT-3]` Derived flags

```ts
isVegetarian = noMeatOrFish(ownIngredients) && linked.every((r) => r.isVegetarian) && !meals.includes('dessert')
isSpice = ownIngredients.length > 0 && ownIngredients.every((i) => i.category === 'spices')
isMagimix = steps.some((s) => s.kind === 'magimix')
```

`resolveAutoFlags` receives `steps: RecipeStep[]` instead of `instructions: string`. A Magimix step
inside an embedded sub-recipe does not make the parent Magimix, matching the previous behavior.

### `[CT-4]` Media and invalidation

An image file becomes a Cloudflare Images transformed WebP (bounded width and quality) under a random
R2 key; a video keeps its bytes and content type under an opaque key; a retained reference keeps its
key. D1 stores keys, never public URLs; display resolves them through media routes. Stale keys are
deleted best-effort after the database write. Create invalidates recipe-list keys; update and delete
invalidate the all-recipes key family.

## Acceptance

- `[VC-1]` Given a create request with one step of each kind, when it succeeds, then the detail
  projection returns the same steps in order with positions 1–3. — demonstrates `[SO-1]`
- `[VC-2]` Given an existing recipe with 3 steps, when updated with 2 different steps, then exactly
  the 2 new steps remain for that recipe and other recipes' steps are untouched. — demonstrates `[SO-1]`
- `[VC-3]` Given a direct insert of a `magimix_steps` row with a null `program`, or a `subrecipe_steps`
  row with a null `subrecipe_id`, when executed against D1, then a `NOT NULL` constraint rejects it. —
  demonstrates `[SO-2]`
- `[VC-4]` Given a submission whose sub-recipe step references a recipe absent from `linkedRecipes`,
  or the recipe's own id, when submitted, then the API returns 400 and nothing is written. —
  demonstrates `[SO-2]`
- `[VC-5]` Given steps with and without a `magimix` step, when flags are computed, then `isMagimix`
  is true and false respectively (`computeAutoFlags` test). — demonstrates `[SO-3]`
- `[VC-6]` Given a non-owner non-admin user, or a malformed payload, when create/update/delete is
  called, then it fails and neither D1 nor R2 changes. — demonstrates `[SO-4]`

## Caveats

- `[C-1]` Foreign-key constraints require child rows (ingredients, groups, links, steps) to disappear
  ahead of their parent.
- `[C-2]` A linked recipe prevents deleting its target until the referencing recipe removes the link
  and any sub-recipe step pointing to it.
- `[C-3]` _Superseded by [KD-6]:_ a sub-recipe step now has a relational foreign key.
- `[C-4]` A graph-write failure triggers compensation that avoids exposing a partial aggregate.
- `[C-5]` `(recipe_id, position)` uniqueness holds per table only; cross-table uniqueness relies on
  the write path deriving positions from the submitted array index.

## Open Questions

N/A
