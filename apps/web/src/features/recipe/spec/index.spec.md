---
title: Recipe Feature
kind: umbrella
status: amended
author: Antoine Bouteiller
date: 2026-08-14
related: [docs/architecture.spec.md]
---

## Why

French-speaking home cooks need a private place to compose, find, and prepare recipes whose
preparation can express appliance programs and reused recipes. The recipe feature makes a recipe a
structured, scalable cooking document — title, servings, image, ingredient groups, ordered
preparation steps, optional video — while keeping its data useful to ingredients, search, and
shopping-list features.

- `[G-1]` Let an approved user create, revise, and remove recipes while preserving recipe ownership.
- `[G-2]` Make a recipe easy to browse, find, read, and scale while cooking on phone or desktop.
- `[G-3]` Represent preparation as ordered, typed steps, where Magimix programs and embedded
  sub-recipes are step kinds of their own.
- `[G-4]` Provide recipe data in shapes that ingredient, search, and shopping-list experiences can
  consume without duplicating recipe state.

- `[NG-1]` Collaborative, concurrent editing of one recipe.
- `[NG-2]` Public or anonymous recipe access, refining `docs/architecture.spec.md` [NG-1].
- `[NG-3]` Persisting per-user serving quantities or shopping-list membership on the recipe row.
- `[NG-4]` Treating a sub-recipe step as an ownership relation; it is a view onto a linked recipe.

## Design

- `[PI-1]` **Recipe writes are authoritative** — only the server determines ownership, validation,
  derived flags, and persisted media keys.
- `[PI-2]` **Preparation is structured data** — appliance programs and reused recipes are typed
  steps, not conventions hidden in prose or rich-text nodes.
- `[PI-3]` **Cooking stays legible** — detail layouts show ingredients and preparation together where
  screen space permits.
- `[PI-4]` **Derived facts stay derived** — flags such as vegetarian and Magimix come from the
  submitted aggregate rather than editable client state.

| Decision                    | Choice                                                                                                                                                                                          | Rationale                                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Recipe aggregate   | A recipe owns its ingredient groups, ingredient rows, linked-recipe ratios, ordered steps, and media keys.                                                                                      | The cooking document stays coherent when it is read, replaced, or deleted.                                                                  |
| `[KD-2]` Write authority    | Guarded API routes validate form data, decide ownership, derive flags, and persist the aggregate.                                                                                               | Browser state cannot be trusted to authorize writes or derive durable recipe facts.                                                         |
| `[KD-3]` Read model         | List queries return card-sized recipes; detail queries return ingredients, links, and steps.                                                                                                    | Each surface receives enough data without making routine browsing carry the full document.                                                  |
| `[KD-4]` Preparation format | Preparation is an ordered list of polymorphic steps — `text` (bold-only markdown), `magimix`, `subrecipe` — stored as rows in one table per kind. Supersedes Lexical JSON with decorator nodes. | The server can validate, query, and derive flags from typed steps; sub-recipe references get a real foreign key; recipe code drops Lexical. |
| `[KD-5]` Client selections  | Shopping-list membership and serving quantities stay in client stores keyed by recipe id.                                                                                                       | These choices are personal, immediate UI state rather than recipe data.                                                                     |

Recipes reuse other recipes in two deliberately different ways: a linked recipe contributes its
default ingredient group and a ratio to the ingredient graph, while a sub-recipe step shows a range of
that linked recipe's steps at a point in the preparation. A sub-recipe step always points to a linked
recipe (`crud.spec.md` [KD-5]), so both reuses describe one declared relation.

```text
                 Recipe form (StepsField)
                     │ FormData
                     ▼
 ┌────────────── recipe write boundary ──────────────┐
 │ validation · ownership · flags · media · aggregate │──► D1 (recipes, groups, links, *_steps)   / R2
 └───────────────────────────────────────────────────┘
                     │
                     ▼
       list/detail/instructions queries ──► cards, search, cooking view (RecipeSteps)
```

## Outcome

- `[SO-1]` An approved user creates, edits, and deletes recipes, guarded by owner-or-admin
  authorization. — demonstrated by `[VC-1]`
- `[SO-2]` A recipe's preparation is an ordered list of text, Magimix, and sub-recipe steps, edited
  in the form and rendered on the cooking view. — demonstrated by `[VC-2]`
- `[SO-3]` Cards, search, and the cooking view read shared projections, and quantities and
  shopping-list membership stay client state. — demonstrated by `[VC-3]`

## Contracts

### `[CT-1]` Leaf inventory

| Leaf                           | Owns                                                                                                                     | Key contracts                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| [`crud`](./crud.spec.md)       | `apps/api/src/routes/recipe/**`, `apps/api/db/schema/recipe*.ts`                                                         | step tables [CT-1], write flow [CT-2], flags [CT-3]  |
| [`editor`](./editor.spec.md)   | `RecipeStep` schema and Magimix constants in `packages/shared/src/recipe/`, `StepsField`, `RecipeSteps`, `parseBoldText` | step model [CT-1], bold text [CT-2], renderer [CT-4] |
| [`display`](./display.spec.md) | list/detail/instructions queries, cards, search, cooking view, media handlers                                            | projections [CT-1], cooking view [CT-3]              |

Dependencies: `crud.spec.md` [CT-1] persists `editor.spec.md` [CT-1]; `display.spec.md` [CT-1]
returns it; `display.spec.md` [CT-3] renders it through `editor.spec.md` [CT-4].

### `[CT-2]` Public boundary

| Information                                       | Durable owner             | Consumer              |
| ------------------------------------------------- | ------------------------- | --------------------- |
| Recipe identity, ingredients, links, steps, media | Recipe aggregate (D1, R2) | CRUD and detail query |
| List projection and derived flags                 | Recipe query contract     | Cards and search      |
| Quantity and shopping-list selection              | Client stores             | Quantity controls     |

The feature exposes query-option factories (list, detail, instructions), mutation-option factories
(create, update, delete), the shared `recipeStepSchema`, and its components. Ingredients contribute
catalogue ids and units; search consumes the list projection; shopping-list state consumes recipe
ids; none reach into recipe internals.

## Acceptance

- `[VC-1]` Given an owner, another user, and an admin, when each updates or deletes the same recipe,
  then only the owner and admin succeed (`crud.spec.md` [VC-6]). — demonstrates `[SO-1]`
- `[VC-2]` Given a recipe saved with one step of each kind, when its detail page opens, then the
  steps render in order with bold text, the Magimix item, and the sub-recipe section, and the card
  shows the Magimix flag (`editor.spec.md` [VC-1], [VC-5]; `crud.spec.md` [VC-1], [VC-5]). —
  demonstrates `[SO-2]`
- `[VC-3]` Given the home grid and a detail page, when the cook changes quantity and shopping-list
  membership, then no recipe mutation is sent (`display.spec.md` [VC-1], [VC-2]). — demonstrates `[SO-3]`

## Caveats

- `[C-1]` A recipe cannot be deleted while another recipe links to it or embeds its steps.
- `[C-2]` Media objects live outside D1; stale-object cleanup is best effort after a successful write.
- `[C-3]` A sub-recipe section fetches its source steps independently and can lag according to query
  freshness.
- `[C-4]` _Superseded by [KD-4]:_ Magimix detection no longer depends on a serialized marker.
- `[C-5]` The form submits the full ingredient, link, and step graph on each write, trading row-level
  edits for a predictable aggregate.

## Open Questions

N/A
