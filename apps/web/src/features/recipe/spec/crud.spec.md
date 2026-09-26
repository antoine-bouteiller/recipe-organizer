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

| Decision                       | Choice                                                                                                                                                 | Rationale                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Validation boundary   | Create and update accept `FormData`, parse it into typed values, and validate it inside guarded API routes.                                            | Multipart files and structured fields reach one trust boundary that gates storage effects.                                                    |
| `[KD-2]` Aggregate replacement | Update removes the recipe's outgoing graph rows — ingredient groups, ingredients, links, and steps — and writes the submitted graph.                   | The submitted form is the complete aggregate, avoiding an error-prone row-level diff.                                                         |
| `[KD-3]` Derived flags         | The write path derives `isVegetarian`, `isSpice`, and `isMagimix`; `isMagimix` is true when any own-group step has `kind: 'magimix'`.                  | Durable flags stay consistent with the graph; a typed step replaces the former `"type":"magimixProgram"` string marker.                       |
| `[KD-4]` Media lifecycle       | Images pass through a transform into R2; videos retain uploaded bytes; stale keys use best-effort deletion.                                            | Images have a bounded delivery format while media-cleanup failure does not invalidate a committed recipe.                                     |
| `[KD-5]` Sub-recipe integrity  | A `subrecipe` step group's `recipeId` must be one of the submitted linked-recipe ids and differ from the recipe's own id; otherwise 400.               | The step reference stays a view onto a declared relation, and the server no longer trusts the picker.                                         |
| `[KD-6]` Table per step kind   | _Superseded by [KD-7]._                                                                                                                                | —                                                                                                                                             |
| `[KD-7]` Step groups and spine | `recipe_step_groups` orders groups per recipe; `recipe_steps` orders steps per group; `text_steps` and `magimix_steps` hold kind columns by `step_id`. | Ordering lives in one table, so unique indexes validate it; groups mirror ingredient groups, and a sub-recipe group keeps a real foreign key. |

## Outcome

- `[SO-1]` Create and update persist a recipe's ordered step groups and their ordered, typed steps
  inside the same aggregate write as its ingredients and links. — demonstrated by `[VC-1]`, `[VC-2]`
- `[SO-2]` The database and the write boundary reject inconsistent steps: a missing required field
  for a kind, a duplicate position, or a sub-recipe group outside the recipe's linked recipes. — demonstrated by `[VC-3]`, `[VC-4]`
- `[SO-3]` `isMagimix` follows the presence of a Magimix step. — demonstrated by `[VC-5]`
- `[SO-4]` Mutations stay owner-or-admin guarded, and malformed input causes no storage effect. —
  demonstrated by `[VC-6]`

## Contracts

### `[CT-1]` Step persistence

```text
recipe_step_groups  id · recipe_id · position · is_default · group_name? · subrecipe_id?
  unique (recipe_id, position) · CHECK subrecipe_id IS NULL OR (group_name IS NULL AND NOT is_default)
└── recipe_steps     id · group_id (cascade) · position        unique (group_id, position)
    ├── text_steps     step_id (PK, cascade) · text
    └── magimix_steps  step_id (PK, cascade) · program · rotation_speed · time · temperature?
```

- Positions are 1-based array indexes: groups per recipe, steps per group.
- The first group is the default own-steps group: `is_default`, never named, never a sub-recipe
  group. Later own groups carry an optional name, like ingredient groups.
- A sub-recipe group sets `subrecipe_id` (restrict FK) and owns no steps.
- The kind table is the kind: no discriminator column, and `NOT NULL` replaces CHECK constraints.
- **Write:** one D1 batch inserts groups, steps, and kind rows; each child resolves its parent id
  through the parent's unique position, so the batch needs no returned ids.
- **Read:** one relational query loads groups ordered by position with their ordered steps and kind
  rows; one pure mapper turns rows into `RecipeStepGroup[]` (`editor.spec.md` [CT-1]).
- **Delete:** removing a recipe's groups cascades to their steps and kind rows.
- Optional fields (`temperature`, `group_name`) are `NULL` when absent. Program and speed enums are
  validated by Zod, not by the database.

### `[CT-2]` Aggregate shape and write flow

```text
recipe
├── ingredientGroups[] └── ingredients[] { ingredientId, quantity, unitSlug? }
├── linkedRecipes[] { recipeId, ratio }
├── stepGroups[] RecipeStepGroup       ← replaces `instructions: Lexical JSON`
├── image key
└── video key?

FormData → guarded validator ([KD-5] check) → ownership lookup → media keys + derived flags
         → D1 recipe + graph writes → query invalidation + French feedback
```

- **Input:** the parser preserves `File` values for media and decodes JSON fields, including
  `stepGroups`. A valid image is a file or an already-held media reference; video is optional likewise.
  Ingredient entries pair a non-negative ingredient id and quantity with an optional unit; linked
  recipes pair a non-negative target id with a non-negative ratio; step groups satisfy
  `recipeSchema.stepGroups`, whose first group owns steps.
- **Create** binds `createdBy` to the authenticated user, writes the recipe row, then the graph; a
  graph error compensates by deleting the new recipe (and any rows written under it).
- **Update** loads the recipe and requires owner or admin, then batches removal of group ingredients,
  ingredient groups, outgoing links, and step groups before writing the submitted graph.
- **Delete** requires owner or admin, batches child removal (steps included) ahead of the recipe row,
  then attempts image deletion.
- **Failure:** a missing target is not-found; an unauthorized target or a schema / [KD-5] violation
  produces no media or database effect. Mutation options map failures to French feedback.
- **Referential guard:** a recipe referenced by another recipe's link or `subrecipe_id` cannot be
  deleted (restrict FKs); since [KD-5] requires a link for every sub-recipe group, the link is the
  user-visible reason.

### `[CT-3]` Derived flags

```ts
isVegetarian = noMeatOrFish(ownIngredients) && linked.every((r) => r.isVegetarian) && !meals.includes('dessert')
isSpice = ownIngredients.length > 0 && ownIngredients.every((i) => i.category === 'spices')
isMagimix = ownGroupSteps.some((s) => s.kind === 'magimix')
```

`resolveAutoFlags` receives the flattened steps of own groups. A Magimix step inside an embedded
sub-recipe group does not make the parent Magimix, matching the previous behavior.

### `[CT-4]` Media and invalidation

An image file becomes a Cloudflare Images transformed WebP (bounded width and quality) under a random
R2 key; a video keeps its bytes and content type under an opaque key; a retained reference keeps its
key. D1 stores keys, never public URLs; display resolves them through media routes. Stale keys are
deleted best-effort after the database write. Create invalidates recipe-list keys; update and delete
invalidate the all-recipes key family.

## Acceptance

- `[VC-1]` Given a create request with a default group of one text and one Magimix step, a
  sub-recipe group, and a named group, when it succeeds, then the detail projection returns the same
  groups and steps in order, without a name on the default group. — demonstrates `[SO-1]`
- `[VC-2]` Given an existing recipe with 3 steps, when updated with 2 different steps, then exactly
  the 2 new steps remain for that recipe, no orphan `recipe_steps` row remains, and other recipes'
  steps are untouched. — demonstrates `[SO-1]`
- `[VC-3]` Given a direct insert of a `magimix_steps` row with a null `program`, a second step at an
  existing `(group_id, position)`, or a named sub-recipe group, when executed against D1, then a
  `NOT NULL`, unique, or CHECK constraint rejects it. —
  demonstrates `[SO-2]`
- `[VC-4]` Given a submission whose sub-recipe group references a recipe absent from `linkedRecipes`,
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
  and any sub-recipe group pointing to it.
- `[C-3]` _Superseded by [KD-6]:_ a sub-recipe step now has a relational foreign key.
- `[C-4]` A graph-write failure triggers compensation that avoids exposing a partial aggregate.
- `[C-5]` _Superseded by [KD-7]:_ step positions live in `recipe_steps`, whose unique index covers
  every kind.

## Open Questions

N/A
