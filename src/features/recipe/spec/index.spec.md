---
title: Recipe Feature
kind: umbrella
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
related: [docs/architecture.spec.md]
---

## 2. Problem Statement

French-speaking home cooks need a private place to compose, find, and prepare recipes whose
instructions can express both appliance programs and reusable recipes. The recipe feature makes a
recipe a structured, scalable cooking document rather than a title and free-form note, while keeping
its data useful to ingredients, search, and shopping-list features.

- `[G-1]` Let an approved user create, revise, and remove recipes while preserving recipe ownership.
- `[G-2]` Make a recipe easy to browse, find, read, and scale while cooking on phone or desktop.
- `[G-3]` Represent Magimix programs and embedded sub-recipes as durable instruction content.
- `[G-4]` Provide recipe data in shapes that ingredient, search, and shopping-list experiences can
  consume without duplicating recipe state.

A recipe is the unit a cook recognizes: its title, servings, image, ingredient groups, preparation,
and optional supporting video travel together. The feature treats links as intentional composition:
a parent recipe can include another recipe's ingredients and can also place its instructions at the
relevant preparation point. A user therefore sees a complete cooking context without copying the
source recipe.

## 3. Key Design Decisions

| Decision                    | Choice                                                                                                               | Rationale                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `[KD-1]` Recipe aggregate   | A recipe owns its ingredient groups, ingredient rows, linked-recipe ratios, media keys, and serialized instructions. | The cooking document remains coherent when it is read, replaced, or deleted.               |
| `[KD-2]` Write authority    | Guarded server functions validate form data, decide ownership, derive flags, and persist the aggregate.              | Browser state cannot be trusted to authorize writes or derive durable recipe facts.        |
| `[KD-3]` Read model         | List queries return card-sized recipes; detail queries return ingredients, links, and instructions.                  | Each surface receives enough data without making routine browsing carry the full document. |
| `[KD-4]` Instruction format | Lexical JSON contains standard rich text plus Magimix and sub-recipe decorator nodes.                                | Domain-specific instructions retain structure through editing and read-only rendering.     |
| `[KD-5]` Client selections  | Shopping-list membership and serving quantities stay in client stores keyed by recipe id.                            | These choices are personal, immediate UI state rather than recipe data.                    |

## 4. Principles & Intents

- `[PI-1]` **Recipe writes are authoritative** — only the server determines ownership, validation,
  derived flags, and persisted media keys.
- `[PI-2]` **Instructions are structured content** — appliance steps and reused recipes are nodes,
  not conventions hidden in prose.
- `[PI-3]` **Cooking stays legible** — detail layouts prioritize ingredients and preparation at the
  same time where screen space permits.
- `[PI-4]` **Derived facts stay derived** — flags such as vegetarian and Magimix presence come from
  the submitted aggregate rather than editable client state.

These principles make the recipe feature a source of domain truth rather than a collection of page
components. The CRUD leaf decides what can be stored, the editor leaf decides how instruction
structure survives serialization, and the display leaf decides how that structure is presented. A
cross-feature consumer receives a stable projection or id instead of reaching into feature internals.

## 5. Non-Goals

- `[NG-1]` Collaborative, concurrent editing of one recipe.
- `[NG-2]` Public or anonymous recipe access, refining architecture [NG-1].
- `[NG-3]` Persisting per-user serving quantities or shopping-list membership on the recipe row.
- `[NG-4]` Treating a sub-recipe reference embedded in instructions as an ownership relation.

## 6. Caveats

- `[C-1]` Relational linked-recipe rows prevent deletion of a referenced recipe, while an opaque
  sub-recipe node can reference a recipe that later becomes unavailable.
- `[C-2]` Media objects are separate from D1 rows; stale-object cleanup is best effort following a
  successful write.
- `[C-3]` A sub-recipe preview fetches its source instructions independently and can lag according
  to its query freshness policy.
- `[C-4]` Instruction-node detection depends on compact Lexical JSON containing the node type marker.

The aggregate favors direct, predictable document reads over independent editing of every nested row.
The recipe form supplies the full ingredient and link graph on each write, and the display contract
projects that graph for its specific surface. This keeps recipe behavior understandable at the
expense of treating unusually large ingredient graphs as a single document.

Recipes integrate with other feature boundaries by contract. Ingredient selection contributes ids and
units to the aggregate; search receives the list projection; shopping-list state receives recipe ids;
and user identity reaches the write boundary through server infrastructure. The recipe feature does
not make those systems depend on its component hierarchy.

## 7. High-Level Components

The feature boundary is the recipe aggregate and its cooking presentation. Ingredients contribute
catalogue identities and units; search consumes recipe-list data; shopping-list state consumes recipe
ids. Those features do not own recipe instructions, recipe media, or recipe write authorization.

```text
                 Recipe form
                     │
                     ▼
 ┌────────────── recipe write boundary ──────────────┐
 │ validation · ownership · flags · media · aggregate │──► D1 / R2
 └───────────────────────────────────────────────────┘
                     │
                     ▼
       list/detail queries ──► cards, search, cooking view
                     │
                     ▼
         Lexical instruction nodes and client selections
```

| Information                                              | Durable owner                | Consumer                   |
| -------------------------------------------------------- | ---------------------------- | -------------------------- |
| Recipe identity, ingredients, links, media, instructions | Recipe aggregate             | CRUD and detail query      |
| List projection and derived flags                        | Recipe query contract        | Cards and search           |
| Quantity and shopping-list selection                     | Client stores                | Quantity controls          |
| Magimix and sub-recipe structure                         | Lexical instruction document | Editor and detail renderer |

The aggregate has one recipe identity, a base serving count, media keys, and serialized instructions.
Ingredient groups hold quantities against catalogue ingredients; linked recipes hold a target recipe
identity and a ratio. The two forms of reuse intentionally differ: a relational link contributes to
the ingredient graph, while an instruction node contributes a readable preparation fragment.

The public recipe boundary is intentionally small. Query-option factories offer list, detail, and
instruction projections; mutation-option factories offer create, update, and delete operations;
`recipeNodes` offers the instruction extension set. Components and routes compose those contracts
but do not expose a separate feature-wide service object.

| Component | Module type                        | Responsibility                            | Public API surface                   |
| --------- | ---------------------------------- | ----------------------------------------- | ------------------------------------ |
| CRUD      | Server functions and write utility | Validate and persist the recipe aggregate | mutation options, form schemas       |
| Display   | Queries, routes, components, hooks | Browse and cook recipes                   | list/detail options, cards, controls |
| Editor    | Lexical extensions and dialogs     | Edit and render structured instructions   | `recipeNodes`, node data             |

Leaf execution order:

| Leaf                           | Depends on                         | Rationale                                                           |
| ------------------------------ | ---------------------------------- | ------------------------------------------------------------------- |
| [`crud`](./crud.spec.md)       | server infrastructure              | Establishes the durable aggregate and mutation boundary.            |
| [`editor`](./editor.spec.md)   | `crud` `[KD-2]`                    | Produces the structured instructions and marker consumed by writes. |
| [`display`](./display.spec.md) | `crud` `[KD-3]`, `editor` `[KD-4]` | Renders persisted recipe data and structured instructions.          |

The order expresses design dependencies, not a delivery schedule: the CRUD contract defines the
aggregate; the editor defines the instruction representation it submits; the display leaf consumes
both read contracts. Each leaf has a distinct verification surface: mutation authorization and graph
integrity, node serialization and filtering, or query and responsive rendering.

## 8. Detailed Design

| Component                           | Specified in                           |
| ----------------------------------- | -------------------------------------- |
| Recipe aggregate and mutations      | [`crud.spec.md`](./crud.spec.md)       |
| Recipe queries and cooking surfaces | [`display.spec.md`](./display.spec.md) |
| Structured instruction editor       | [`editor.spec.md`](./editor.spec.md)   |

## 9. Open Questions

N/A
