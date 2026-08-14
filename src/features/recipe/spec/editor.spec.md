---
title: Recipe Instruction Editor
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: src/features/recipe/spec/index.spec.md
related: [docs/infrastructure/client/forms.spec.md, src/features/recipe/spec/crud.spec.md]
---

## 2. Problem Statement

N/A — goals remain owned by `src/features/recipe/spec/index.spec.md` [G-3]. This leaf owns the
recipe-specific Lexical nodes that let instructions carry appliance programs and selected linked
recipes without flattening either into text.

## 3. Key Design Decisions

| Decision                          | Choice                                                                                       | Rationale                                                                                           |
| --------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `[KD-1]` Domain-node registration | Every recipe editor receives `recipeNodes`, containing MagimixProgramNode and SubrecipeNode. | Serialized recipe instructions can be interpreted consistently in edit, detail, and embedded views. |
| `[KD-2]` Node representation      | Both recipe nodes are Lexical decorator nodes with JSON and DOM import/export contracts.     | Atomic, custom React surfaces fit decorator nodes while retaining portable document data.           |
| `[KD-3]` Sub-recipe selection     | The dialog offers only recipe ids selected in the form's linked-recipe rows.                 | Embedded instruction references stay aligned with the declared recipe relationship.                 |
| `[KD-4]` Magimix flag signal      | A Magimix node serializes `type: "magimixProgram"` in compact JSON.                          | The CRUD leaf can derive its durable flag without loading Lexical on the server.                    |

## 4. Principles & Intents

- `[PI-1]` **Nodes round-trip** — JSON and DOM forms preserve node data needed to render the same
  cooking instruction.
- `[PI-2]` **Read-only stays read-only** — detail and embedded views render node content without
  mounting edit dialogs.
- `[PI-3]` **References remain live** — a sub-recipe stores an id and fetches instructions rather
  than copying another recipe's document.

## 5. Non-Goals

- `[NG-1]` Owning the shared Lexical editor and its generic formatting capabilities.
- `[NG-2]` Calculating recipe flags, refining the CRUD leaf [KD-3].
- `[NG-3]` Allowing an embedded sub-recipe to select an arbitrary recipe outside the form's links.

## 6. Caveats

- `[C-1]` The Magimix flag contract requires compact JSON ordering to preserve the exact marker
  consumed by the CRUD leaf [KD-3].
- `[C-2]` An unavailable sub-recipe yields no embedded content because the reference has no
  relational foreign-key enforcement.
- `[C-3]` Embedded instructions follow query freshness and can briefly lag behind their source
  recipe.

## 7. High-Level Components

| Component             | Module type               | Responsibility                               | Public API surface                          |
| --------------------- | ------------------------- | -------------------------------------------- | ------------------------------------------- |
| Extension registry    | Lexical configuration     | Register recipe node classes                 | `recipeNodes`                               |
| Magimix node          | Decorator node and dialog | Store and edit appliance-program data        | `MagimixProgramNode`, `MagimixProgramData`  |
| Sub-recipe node       | Decorator node and dialog | Store and render a filtered recipe reference | `SubrecipeNode`, `SubrecipeNodeData`        |
| Linked-recipe context | React context             | Supply eligible ids to the node dialog       | `LinkedRecipesProvider`, `useLinkedRecipes` |

## 8. Detailed Design

### 8.1 Instruction document

```text
Lexical root
├── standard rich-text nodes
├── magimixProgram { program, rotationSpeed, time, temperature? }
└── subrecipe { recipeId, hideFirstNodes, hideLastNodes }
```

`recipeNodes` registers both decorator-node classes whenever recipe instructions are editable,
shown on a detail page, or rendered inside a sub-recipe. The recipe form places Magimix and
sub-recipe controls in its extra toolbar. Node updates execute through Lexical's editor transaction
and writable-node API, preserving document-state tracking.

| Node            | Serialized data                         | Read-only presentation      | Edit presentation                |
| --------------- | --------------------------------------- | --------------------------- | -------------------------------- |
| Magimix program | program, speed, time, temperature?      | Appliance-program item      | Item-backed program dialog       |
| Sub-recipe      | recipe id, leading/trailing hide counts | Nested instruction document | Dashed dialog trigger and picker |

The node registry is deliberately feature-local. The shared editor receives a list of node classes
and remains responsible for generic rich-text behavior; recipe code supplies the appliance and recipe
composition semantics. This division keeps a recipe document portable across every feature surface
that registers the same two node classes.

### 8.2 Magimix program node

A Magimix program stores a program identifier, rotation speed, total time in seconds, and optional
temperature. Its dialog validates supported program and speed values, temperature from zero through
200, and minute/second values through 60; it converts the two time fields to total seconds for
insertion or update.

The rendered item shows the program image and French label, formatted duration, speed, and optional
temperature. Edit mode opens a prefilled dialog; read-only mode renders the item alone. JSON export
includes node type `magimixProgram` and version `1`, yielding the marker consumed by CRUD [KD-3].
DOM export uses a `data-type="magimix-program"` container plus node attributes, enabling HTML
round-trips.

A program button inserts a node at the nearest root through a Lexical editor transaction, then returns
focus to the editor. Selecting an item in edit mode opens the same dialog with its stored values and
writes all changed fields within one transaction. The decorator's layout wrapper is transparent, so
the rendered appliance item participates in the surrounding instruction flow without an additional
visual block.

### 8.3 Sub-recipe node

A sub-recipe stores its recipe id and counts of leading and trailing instruction nodes to hide. The
linked-recipes provider derives eligible positive ids from the form's linked-recipe values. The dialog
uses that context to constrain its picker, then stores the selected id and hide counts in the node.

The context tracks the form's selected positive ids reactively. Placeholder link rows have no eligible
id, so they cannot become embedded instructions. This keeps an incomplete form from serializing a
sub-recipe reference that the relational aggregate does not declare.

The renderer fetches only the referenced recipe name and instructions. It filters the serialized
root children by the hide counts and passes the resulting state to a nested read-only editor. Its DOM
form uses `data-type="subrecipe"`; zero hide counts remain implicit, while JSON export always
contains the node type, version, id, and counts.

### 8.4 Filtering and unavailable references

Filtering parses the referenced serialized state and slices root children according to the leading and
trailing hide counts. A range that contains no eligible content produces a valid editor state with no
children, so the nested renderer remains structurally valid. The source recipe name still identifies
the embedded section when its filtered body is empty.

The renderer fetches the source projection by recipe id and renders no embedded body when that
projection is unavailable. This is a graceful display outcome for an opaque instruction reference;
the relational linked-recipe graph remains the durable composition relationship owned by CRUD.

### 8.5 Serialization contract

Both nodes clone their complete stored data and implement JSON and DOM import/export. Magimix DOM
uses a `magimix-program` data type and program attributes; sub-recipe DOM uses its id and optional
non-zero hide attributes. JSON always carries node type and version, making it the authoritative
persistence form.

Compact JSON emits the Magimix type marker exactly as `"type":"magimixProgram"`. The CRUD leaf
uses that marker only as a signal for its derived flag; the document itself remains the source of
program details and read-only rendering.

The serialization contract also separates visual affordance from document data. Labels, icons,
dialog triggers, and dashed edit borders are renderer choices; program values, recipe ids, and hide
counts are node data. A different renderer can therefore present the same persisted instructions
without recovering information from visual markup.

## 9. Open Questions

N/A
