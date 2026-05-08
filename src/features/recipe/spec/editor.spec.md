---
title: Recipe Feature - Rich Text Editor (Lexical, Magimix, Subrecipe)
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [feature, recipe, editor, lexical, magimix, subrecipe]
---

# Introduction

This spec covers the rich-text editor that produces and renders `recipes.instructions`. The
editor is built on Lexical (`lexical`, `@lexical/react`, `@lexical/utils`) and is shared via the
`Editor` component in `src/components/ui/editor`. The recipe feature contributes two custom
domain nodes: `MagimixProgramNode` and `SubrecipeNode`. Both are registered through the
`recipeNodes` array and surfaced as toolbar buttons in edit mode.

The editor is also the producer side of the auto-`magimix` tag: it writes the marker substring
`"types":"magimixProgram"` into the serialized JSON state, which the server-side
`computeAutoTags` (see [crud.spec.md](./crud.spec.md)) detects via `String.includes`.

Source files:

- `src/features/recipe/components/editor/extensions.ts`
- `src/features/recipe/components/editor/magimix/{magimix-program-button,magimix-program-dialog,magimix-program-node}.tsx`
- `src/features/recipe/components/editor/subrecipe/{subrecipe-button,subrecipe-dialog,subrecipe-node}.tsx`
- `src/features/recipe/types/{magimix,subrecipe}.ts`
- `src/features/recipe/contexts/linked-recipes-context.tsx`
- `src/features/recipe/components/recipe-form.tsx` (toolbar wiring)

## 1. Purpose & Scope

### Purpose

Provide a rich-text editing experience for recipe instructions that:

- supports the standard Lexical formatting from the shared `Editor` component;
- lets the user insert and edit _Magimix programs_ (a structured Cook Expert step) inline;
- lets the user embed _another recipe's instructions_ inline, optionally hiding leading/trailing
  paragraphs;
- serializes deterministically so the server-side magimix-detection regex-free check is reliable;
- renders identically in read-only mode on the recipe detail page.

### Out of scope

- The shared `Editor` core (`src/components/ui/editor/`); this spec only covers the recipe-feature
  nodes and the recipe form's toolbar wiring.
- Auto-tag _computation_ on save (owned by [crud.spec.md](./crud.spec.md)); this spec only
  guarantees the marker substring contract.

## 2. Definitions

| Term                   | Meaning                                                                                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recipeNodes`          | `readonly Klass<LexicalNode>[]` exported from `editor/extensions.ts`, registered with the shared `Editor` whenever recipe instructions are rendered or edited. |
| `MagimixProgramNode`   | `DecoratorNode` with type string `'magimixProgram'`, exported as `MagimixProgramNode` (alias of `MagimixProgramNodeType`).                                     |
| `SubrecipeNode`        | `DecoratorNode` with type string `'subrecipe'`, exported as `SubrecipeNode` (alias of `SubrecipeNodeType`).                                                    |
| Marker substring       | The literal `"types":"magimixProgram"` that appears in any serialized state containing at least one Magimix node.                                              |
| `MagimixProgramData`   | `{ program, rotationSpeed, time, temperature? }` from `types/magimix.ts`.                                                                                      |
| `SubrecipeNodeData`    | `{ recipeId, hideFirstNodes, hideLastNodes }` from `types/subrecipe.ts`.                                                                                       |
| `LinkedRecipesContext` | React context providing `linkedRecipeIds: number[]` (the form's currently-selected linked recipes) so the SubrecipeDialog can restrict its picker.             |

## 3. Requirements, Constraints & Guidelines

### Requirements

- **REQ-001** `recipeNodes` MUST export both `MagimixProgramNode` and `SubrecipeNode`:

  ```ts
  export const recipeNodes: readonly Klass<LexicalNode>[] = [MagimixProgramNode, SubrecipeNode]
  ```

- **REQ-002** Every consumer that renders recipe instructions (read-only or editable) MUST pass
  `nodes={recipeNodes}` to the shared `<Editor>`. Current call sites:
  - `recipe-form.tsx` → `<EditorField nodes={recipeNodes} extraToolbar={...}>` (editable);
  - `routes/recipe/$id.tsx` → `<Editor nodes={recipeNodes} readOnly>` (mobile and desktop);
  - `subrecipe-node.tsx` → `<Editor nodes={recipeNodes} readOnly>` for the embedded preview.
- **REQ-003** The `RecipeForm` toolbar MUST render `<MagimixProgramButton />` and
  `<SubrecipeButton />` inside an `extraToolbar` slot composed of `ToolbarSeparator` +
  `ToolbarGroup`.
- **REQ-004** `MagimixProgramNode` MUST implement, via `DecoratorNode<React.ReactElement>`:
  - `static getType() === 'magimixProgram'`,
  - `static clone(node)` preserving `__program, __rotationSpeed, __time, __temperature, __key`,
  - `static importDOM()` recognizing `<div data-type="magimix-program">` with optional
    `data-program`, `data-rotation-speed`, `data-temperature`, `data-time` attributes,
  - `exportDOM()` writing the same `data-*` attributes,
  - `static importJSON(json)` and `exportJSON()` returning a
    `SerializedMagimixProgramNode = Spread<{ program, rotationSpeed, temperature?, time, type:
'magimixProgram', version: 1 }, SerializedLexicalNode>`,
  - `isInline() === false`,
  - `createDOM()` returns a `div` with `style.display = 'contents'` (transparent layout),
  - `decorate(editor)` returns `<MagimixProgramComponent isEditable={editor.isEditable()} ...>`.
- **REQ-005** `MagimixProgramComponent`:
  - displays an `<Item>` with the program icon (`/magimix/{program}.png`), label
    (`magimixProgramLabels[program]`), formatted time (`Xmin Ys` / `Ys` / `Xmin`), capitalized
    rotation speed, and temperature with `°C` suffix;
  - in editable mode, wraps the `Item` in `<MagimixProgramDialog>` (initialized from current
    attrs, `submitLabel="Enregistrer"`, `title="Modifier le programme Magimix"`);
  - on submit, calls `editor.update(() => { node.getWritable().__program = ... })` to mutate the
    node in place.
- **REQ-006** `MagimixProgramButton`:
  - calls `useLexicalComposerContext()` for the editor reference;
  - opens `MagimixProgramDialog` (`title="Ajouter un programme Magimix"`,
    `submitLabel="Insérer"`);
  - on submit, runs `editor.update(() => $insertNodeToNearestRoot($createMagimixProgramNode(data)))`
    and refocuses the editor.
- **REQ-007** `MagimixProgramDialog` validates with the Zod schema:

  ```ts
  z.object({
    program: z.enum(magimixProgram),
    rotationSpeed: z.enum(allowedRotationSpeed),
    temperature: z.number().min(0).max(200).optional(),
    timeMinutes: z.number().min(0).max(60),
    timeSeconds: z.number().min(0).max(60),
  })
  ```

  and computes `time = timeMinutes * 60 + timeSeconds` before invoking `onSubmit`.

- **REQ-008** `SubrecipeNode` MUST mirror the `MagimixProgramNode` decorator-node pattern:
  - `static getType() === 'subrecipe'`,
  - `static clone(node)` preserving `__recipeId, __hideFirstNodes, __hideLastNodes, __key`,
  - `importDOM` recognizes `<div data-type="subrecipe">` with `data-recipe-id`,
    `data-hide-first-nodes` (default 0), `data-hide-last-nodes` (default 0);
  - `exportDOM` only emits `data-hide-first-nodes`/`data-hide-last-nodes` when non-zero;
  - `importJSON`/`exportJSON` round-trips
    `SerializedSubrecipeNode = Spread<{ hideFirstNodes, hideLastNodes, recipeId, type:
'subrecipe', version: 1 }, SerializedLexicalNode>`.
- **REQ-009** `SubrecipeComponent`:
  - calls `useQuery(getRecipeInstructionsOptions(recipeId))` to fetch the linked recipe's name
    and instructions;
  - returns `null` until the query has data;
  - in editable mode, wraps the preview in a dashed-border button rendered as the
    `SubrecipeDialog` trigger;
  - in read-only mode, renders the `<strong>{recipe.name}</strong>` heading followed by a nested
    read-only `<Editor content={filteredInstructions} nodes={recipeNodes} readOnly>`.
- **REQ-010** `filterNodes(state, hideFirstNodes, hideLastNodes)`:
  - parses the JSON, slices `root.children` from `startIndex = hideFirstNodes ?? 0` to
    `endIndex = totalNodes - hideLastNodes` (where `totalNodes = children.length - 1`),
  - returns a stringified state with empty `children` if `startIndex >= endIndex || startIndex >=
totalNodes`,
  - otherwise returns the sliced children.
- **REQ-011** `SubrecipeDialog`:
  - validates with `z.object({ hideFirstNodes: z.number().min(0), hideLastNodes:
z.number().min(0), recipeId: z.number() })`;
  - uses `useRecipeOptions({ filter: r => linkedRecipeIds.includes(r.id) })` from
    `useLinkedRecipes()` so the user can only pick recipes that are already linked at the form
    level;
  - exposes a `<ComboboxField label="Recette">` plus two `<NumberField>`s.
- **REQ-012** `LinkedRecipesProvider` MUST wrap the editor field in `recipe-form.tsx` with
  `linkedRecipeIds = form.values.linkedRecipes.map(lr => lr.id).filter(id => id > 0)` so newly
  added unselected linked rows (`id === -1`) are excluded.
- **REQ-013** Auto-`magimix` tag contract: at least one `MagimixProgramNode` in the serialized
  state implies the substring `"types":"magimixProgram"` appears in the `instructions` string.
  This MUST hold regardless of editor formatting (no whitespace, no key-reordering between
  `type` and the value). The server's `instructions.includes('"types":"magimixProgram"')` check
  depends on this.
- **REQ-014** `MagimixProgramNode.exportJSON()` MUST emit `type: 'magimixProgram'` (the marker)
  AND `version: 1`. Lexical serializers consistently emit `"type":"<value>"` without
  intervening whitespace.

### Constraints

- **CON-001** `MagimixProgramDialog` and `SubrecipeDialog` are TanStack React Form forms that
  spawn from inside Lexical's React tree. Updates MUST go through `editor.update(...)` +
  `getWritable()` to be tracked.
- **CON-002** The `display: contents` outer `div` is intentional: Lexical wants a single root
  element per decorator, but the visual tree is owned by the inner `MagimixProgramComponent` /
  `SubrecipeComponent`.
- **CON-003** `getRecipeInstructionsOptions(id)` has `staleTime: 5 minutes`. Subrecipe content
  may lag for up to 5 min after the linked recipe is edited; acceptable for now.
- **CON-004** `linkedRecipeIds` is reactive via `useStore(form.store, ...)`; switching a linked
  row from one recipe to another updates the SubrecipeDialog's pickable list immediately.
- **CON-005** The Magimix marker substring MUST not appear naturally in user-typed text. The
  literal characters `"types":"magimixProgram"` (including quotes) inside a paragraph would NOT
  match because Lexical serializes paragraph text into an entirely different shape — the user
  would have to type `"type":"magimixProgram"` (with `type` not `types`); the actual marker is
  `"types":"magimixProgram"` which is unique to the `exportJSON` shape... NOTE: see §9 EC-005
  for the actual literal in source.

### Guidelines

- **GUD-001** Always check `editor.isEditable()` from `decorate(editor)` before rendering the
  edit-affordance variant of a decorator component. Read-only renders MUST NOT mount any dialog.
- **GUD-002** When mutating decorator state, batch all writes inside a single
  `editor.update(() => { ... node.getWritable() ... })` call.
- **GUD-003** Add new domain nodes by extending `recipeNodes`; do NOT register them on the
  shared `Editor` directly.

## 4. Interfaces & Data Contracts

### Type exports

```ts
// types/magimix.ts
export const magimixProgram = [
  'expert',
  'pureed-soup',
  'cream-soup',
  'simmer',
  'stir-fry',
  'steam',
  'frozen-dessert',
  'crushed-ice',
  'smoothie',
  'pastry-cake',
  'beaten-egg-white',
  'bread-brioche',
  'robot',
  'chocolate',
  'pizza',
] as const
export type MagimixProgram = (typeof magimixProgram)[number]
export const allowedRotationSpeed = ['1A', '2A', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', 'auto'] as const
export interface MagimixProgramData {
  program: MagimixProgram
  rotationSpeed: (typeof allowedRotationSpeed)[number]
  temperature?: number
  time: number // seconds
}
export const magimixProgramLabels: Record<MagimixProgram, string>

// types/subrecipe.ts
export interface SubrecipeNodeData {
  hideFirstNodes: number
  hideLastNodes: number
  recipeId: number
}
```

### Serialized node JSON

```ts
// MagimixProgramNode
type SerializedMagimixProgramNode = Spread<
  {
    program: string
    rotationSpeed: string
    temperature?: number
    time: number
    type: 'magimixProgram'
    version: 1
  },
  SerializedLexicalNode
>

// SubrecipeNode
type SerializedSubrecipeNode = Spread<
  {
    hideFirstNodes: number
    hideLastNodes: number
    recipeId: number
    type: 'subrecipe'
    version: 1
  },
  SerializedLexicalNode
>
```

### Component signatures

```tsx
<MagimixProgramButton />                         // toolbar button, no props
<SubrecipeButton />                              // toolbar button, no props

<MagimixProgramDialog
  initialData?: MagimixProgramFormInput
  onSubmit: (data: MagimixProgramData) => void
  submitLabel: string
  title: string
  triggerRender?: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
/>

<SubrecipeDialog
  initialData?: SubrecipeFormInput
  onSubmit: (data: SubrecipeNodeData) => void
  submitLabel: string
  title: string
  triggerRender?: ...
/>

<LinkedRecipesProvider linkedRecipeIds={number[]}>{children}</LinkedRecipesProvider>
useLinkedRecipes(): number[]
```

## 5. Acceptance Criteria

- **AC-001** Inserting a Magimix program via the toolbar produces a new `MagimixProgramNode` at
  the nearest root, and the editor immediately renders the program card.
- **AC-002** Clicking an existing Magimix card in edit mode opens `MagimixProgramDialog`
  pre-filled with the current attributes; submitting writes the new attributes through
  `node.getWritable()`.
- **AC-003** Saving a recipe whose instructions contain at least one Magimix node persists
  `tags` including `'magimix'` (verified end-to-end with [crud.spec.md](./crud.spec.md)).
- **AC-004** Inserting a subrecipe restricted to a recipe in `linkedRecipeIds` produces a
  `SubrecipeNode`; on the detail page, the embedded recipe's filtered instructions render inside
  the parent.
- **AC-005** `hideFirstNodes = N` causes the embedded preview to skip the first `N`
  paragraphs of the linked recipe's instructions; `hideLastNodes = M` skips the last `M`.
- **AC-006** Round-tripping a recipe through save → load → render produces an editor state
  byte-identical to the saved JSON (Lexical serialization is deterministic and the marker
  survives).
- **AC-007** In read-only mode (recipe detail page), neither the Magimix card nor the subrecipe
  preview opens its editing dialog on click.
- **AC-008** `SubrecipeDialog` only lists recipes whose ids are present in
  `useLinkedRecipes()`; selecting one whose id is `-1` (placeholder) is impossible because the
  list filters them out.

## 6. Test Automation Strategy

- **PAT-001** Snapshot the `exportJSON()` output of `MagimixProgramNode` and `SubrecipeNode` for
  representative inputs and assert the marker substring on the Magimix snapshot.
- **PAT-002** Test `filterNodes(state, hideFirstNodes, hideLastNodes)` directly with crafted
  serialized states (boundary cases: full hide, no hide, both hides exceeding total).
- **PAT-003** Component test for `MagimixProgramDialog`: invalid `timeSeconds = 65` rejects;
  valid `timeMinutes = 2, timeSeconds = 30` invokes `onSubmit({ time: 150, ... })`.
- **PAT-004** Component test for `SubrecipeDialog`: with `linkedRecipeIds = [3, 5]`, the picker
  shows only those two options.
- **PAT-005** Round-trip test: render the editor with a fixture state, programmatically insert a
  Magimix node, serialize, and assert the substring `"types":"magimixProgram"` appears.

## 7. Rationale & Context

- **Why decorator nodes instead of element nodes?** Magimix programs and subrecipes are atomic,
  non-text inserts: the user cannot type inside them, and they have a fully custom UI. Lexical's
  `DecoratorNode` is the right primitive — Lexical owns the placement, React owns the rendering.
- **Why the substring marker for the magimix tag?** The server doesn't load Lexical to inspect
  the editor state; a `String.includes` is O(n) and zero-dependency. The marker piggy-backs on
  Lexical's deterministic serialization.
- **Why fetch the linked recipe's instructions on render?** Embedding the JSON inline in the
  parent would duplicate state and break when the linked recipe is edited. Fetching by id keeps
  the preview live (within the 5-minute `staleTime`).
- **Why a `LinkedRecipesContext`?** The SubrecipeDialog lives deep inside the Lexical decorator
  tree; passing the `linkedRecipeIds` array down via context avoids prop-drilling through
  Lexical's plugin API.
- **Why `display: contents` on the wrapper?** Lexical insists on one DOM element per node;
  `display: contents` makes that element layout-invisible so the decorator's children participate
  in the parent's flow naturally.

## 8. Dependencies & External Integrations

- **`lexical`** core — `DecoratorNode`, `$getNodeByKey`, types `LexicalNode`,
  `SerializedLexicalNode`, `Spread`, `EditorConfig`, `LexicalEditor`, `NodeKey`,
  `DOMConversionMap`, `DOMConversionOutput`, `DOMExportOutput`.
- **`@lexical/react/LexicalComposerContext`** — `useLexicalComposerContext()` for editor
  references in toolbar buttons and decorator components.
- **`@lexical/utils`** — `$insertNodeToNearestRoot`.
- **`@phosphor-icons/react`** — `CookingPotIcon`, `BookOpenIcon`, `SpinnerGapIcon`,
  `ThermometerIcon`, `TimerIcon`.
- **`@tanstack/react-form`** + **`zod`** — both dialog forms.
- **`@tanstack/react-query`** — `useQuery(getRecipeInstructionsOptions(recipeId))` inside
  `SubrecipeNode`.
- **Shared editor** (`@/components/ui/editor`) — `Editor`, `EditorContent` for the read-only
  embedded subrecipe render.
- **`@/hooks/use-options`** — `useRecipeOptions({ filter })` for the SubrecipeDialog's combobox.
- **`@/components/dialogs/form-dialog`** — `getFormDialog(defaults)` factory.

## 9. Examples & Edge Cases

- **EC-001** A program with `time = 0`: the dialog's two `NumberField`s both 0; `formatTime(0)`
  returns `"0s"`.
- **EC-002** A program with `temperature` undefined: `exportDOM` skips the attribute;
  `exportJSON` emits `temperature: undefined` (which JSON.stringify drops). The display falls
  back to the `__` placeholder.
- **EC-003** `SubrecipeNode` for a recipe id that no longer exists (deleted upstream): the
  `useQuery` returns `undefined`, the component returns `null`, leaving a silent gap.
  Mitigation: `delete(recipe)` is restricted by `recipe_linked_recipes` FK at the form-level
  ratio links — but the Lexical reference is opaque to FK constraints, so a stale `__recipeId`
  is possible.
- **EC-004** A subrecipe with `hideFirstNodes >= total - 1`: `filterNodes` returns an empty
  `children` array; the embedded `<Editor>` renders nothing under the `<strong>` heading.
- **EC-005** False positive auto-`magimix`? The literal marker `"types":"magimixProgram"` is
  the precise substring emitted by `exportJSON()` (key `type`, value `magimixProgram`, plus
  Lexical's serialization quirks make `"types"` actually `"type"`). The implementation in
  `api/{create,update}.ts` uses the literal `'"types":"magimixProgram"'`. Either the marker
  works because Lexical's output happens to include this exact substring when a Magimix node is
  present, or there is a bug. Track in the backlog: validate the literal against an actual
  `editor.toJSON()` output and adjust either the producer (the `type` key) or the consumer
  (the substring) accordingly.
- **EC-006** Pasting a `<div data-type="magimix-program" data-program="expert" data-time="60">`
  HTML fragment into the editor: `importDOM` reconstructs a `MagimixProgramNode` with default
  rotation speed `'auto'`.

## 10. Validation Criteria

- The exported `recipeNodes` array MUST contain exactly `[MagimixProgramNode, SubrecipeNode]`.
- Both nodes MUST extend `DecoratorNode<React.ReactElement>` and implement the full
  import/export contract (DOM and JSON).
- Both dialogs MUST use Zod via TanStack React Form's `revalidateLogic()` and `onDynamic`.
- The `SubrecipeDialog` MUST consume `useLinkedRecipes()` and use it to filter
  `useRecipeOptions(...)`.
- The `MagimixProgramComponent`'s `isEditable` branch MUST mount `MagimixProgramDialog` exactly
  once around the visual `Item`; the read-only branch MUST mount `<Item>` directly.

## 11. Related Specifications / Further Reading

- [./index.spec.md](./index.spec.md)
- [./crud.spec.md](./crud.spec.md) — defines the auto-`magimix` tag contract that consumes the
  marker substring this spec produces.
- [./display.spec.md](./display.spec.md) — describes the read-only render of the editor on the
  detail page.
- [../../../../docs/architecture.spec.md](../../../../docs/architecture.spec.md)
- [../../../../docs/infrastructure/data-layer.spec.md](../../../../docs/infrastructure/data-layer.spec.md)
- [../../../../docs/infrastructure/server-functions.spec.md](../../../../docs/infrastructure/server-functions.spec.md)
- [../../../../docs/infrastructure/forms.spec.md](../../../../docs/infrastructure/forms.spec.md)
- [../../../../docs/infrastructure/routing-ssr.spec.md](../../../../docs/infrastructure/routing-ssr.spec.md)
- [../../shopping-list/shopping-list.spec.md](../../shopping-list/shopping-list.spec.md)
- [../../ingredients/ingredients.spec.md](../../ingredients/ingredients.spec.md)
