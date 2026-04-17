---
title: Recipe editor (Lexical) & decorator nodes
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related: [./index.spec.md, ./crud.spec.md]
---

## 2. Problem Statement

Recipe instructions are richer than plain text: they must support embedded Magimix programs (with
program / speed / temperature / time) and cross-recipe sub-recipe embeds (click-through preview). The app:

- `[G-1]` Provides a Lexical-based rich-text editor for authoring instructions, with bold/italic/bullet-list and
  two custom decorator nodes: Magimix program and Subrecipe.
- `[G-2]` Renders the same document tree in read-only mode on the recipe detail page, with the same decorator
  components (inert but visually identical).
- `[G-3]` Stores the editor content as `SerializedEditorState` JSON in `recipe.instructions` (text column).
- `[G-4]` Surfaces toolbar buttons to insert a new Magimix program or Subrecipe via dialogs.
- `[G-5]` Integrates with TanStack Form's `EditorField` so validation / submission work like any other form field.
- `[G-6]` Migrated from Tiptap v3 to Lexical in Apr 2026, with a one-off HTML → Lexical JSON migration script
  under `scripts/`.

## 3. Key Design Decisions

| Decision                                     | Choice                                                                                   | Rationale                                                                                                         |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Editor engine                       | Lexical (migrated from Tiptap v3, Apr 2026)                                              | First-class decorator nodes in React, better SSR story, clean JSON serialization.                                 |
| `[KD-2]` Serialization format                | `SerializedEditorState` JSON string → stored in `recipe.instructions` (text)             | Keeps the DB column type `text`; Drizzle types the field via custom `EditorState` type. No HTML in DB.            |
| `[KD-3]` Custom nodes as `DecoratorNode`     | `MagimixProgramNode` and `SubrecipeNode` extend `DecoratorNode` with React components    | Decorator nodes render arbitrary React inside the editor; double-click opens an edit dialog.                      |
| `[KD-4]` Node registry                       | `recipeNodes` array exported from `components/editor/extensions.ts`                      | Single import point for both the authoring editor and the read-only detail render, so they share node resolution. |
| `[KD-5]` `OnChangePlugin` → form             | Custom `OnChangePlugin` serializes `SerializedEditorState` on every editor change        | Bridges Lexical state into TanStack Form's `EditorField` value.                                                   |
| `[KD-6]` Server-side magimix detection       | Substring search `instructions.includes('"types":"magimixProgram"')` during auto-tagging | Cheaper than a Lexical traversal on the server (which would require bundling Lexical in the Worker).              |
| `[KD-7]` Bullet list + basic formatting only | Toolbar exposes bold, italic, bullet list, Magimix, Subrecipe                            | Keeps authoring surface small; no headings / tables / images-in-text.                                             |

## 4. Principles & Intents

- `[PI-1]` **Shared node registry** — editor and read-only view MUST both import the same `recipeNodes` array so
  a Magimix block renders identically in both modes.
- `[PI-2]` **Read-only is not a different widget** — we use the same `<Editor>` component with `readOnly`, not a
  separate renderer. Avoids the two-renderer maintenance burden.
- `[PI-3]` **Lexical JSON is authoritative** — no "display HTML" stored separately. If the server needs to reason
  about the doc, it does so on the JSON string (cheap substring matches) or punt to the client.
- `[PI-4]` **Decorator dialogs own their validation** — Magimix and Subrecipe dialogs each have their own Zod
  schema; they pre-fill from the node's current data when editing.

## 5. Non-Goals

- `[NG-1]` Collaborative editing (CRDT, presence).
- `[NG-2]` Inline images inside the editor.
- `[NG-3]` Tables, headings H1–H6, code blocks.
- `[NG-4]` Keyboard-driven programmatic formatting beyond Lexical defaults.
- `[NG-5]` Markdown import/export.

## 6. Caveats

- `[C-1]` Auto-tag substring mismatch — the auto-tag code in `api/create.ts` and `api/update.ts` looks for
  `"types":"magimixProgram"` (plural `types`), but the Lexical `MagimixProgramNode` serializes its `type` key as
  singular `"type":"magimixProgram"`. This means the `magimix` auto-tag may never fire for Lexical-authored
  recipes, and only fires for legacy content migrated from Tiptap (which used `types` plural). Confirmed by
  grepping both files. **Fix candidate**: change the server check to look for `"type":"magimixProgram"` (or
  both). Not changed here — track as `[OQ-1]`.
- `[C-2]` `SubrecipeNode` filters its preview content via the recipe's own ingredient-group JSON, so changes to
  the sub-recipe's structure propagate through on next render. Correctness depends on the sub-recipe being
  available in the TanStack Query cache (fetched via `getRecipeInstructionsOptions`).
- `[C-3]` Lexical requires a Suspense / ErrorBoundary parent. The editor component handles this internally, but
  don't strip it.
- `[C-4]` The migration script at `scripts/migrate-instructions-to-lexical.ts` is one-off; do not run it against
  already-migrated data.

## 7. High-Level Components

| Component                 | Module type       | Responsibility                                                                        | Public API surface                                            |
| ------------------------- | ----------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Node registry             | TS export         | Array of custom Lexical node classes to register on both authoring + readonly editors | `recipeNodes`                                                 |
| `MagimixProgramNode`      | Lexical node      | Decorator node: renders Magimix program card; opens dialog on interaction             | `MagimixProgramNode` (class)                                  |
| `MagimixProgramDialog`    | React dialog      | Form to create/edit Magimix program data; Zod-validated                               | `<MagimixProgramDialog />`, `MagimixProgramFormInput`         |
| `MagimixProgramButton`    | React toolbar btn | Toolbar entry point to insert a new Magimix program node                              | `<MagimixProgramButton />`                                    |
| `SubrecipeNode`           | Lexical node      | Decorator node: renders sub-recipe preview via `getRecipeInstructionsOptions`         | `SubrecipeNode` (class)                                       |
| `SubrecipeDialog`         | React dialog      | Form to pick a sub-recipe to embed                                                    | `<SubrecipeDialog />`                                         |
| `SubrecipeButton`         | React toolbar btn | Toolbar entry point to insert a new sub-recipe node                                   | `<SubrecipeButton />`                                         |
| Shared `<Editor>`         | UI component      | Wraps Lexical composer, plugins, toolbar, read-only mode                              | `<Editor>`, `<EditorContent />` from `@/components/ui/editor` |
| `OnChangePlugin` (custom) | Lexical plugin    | Emits `SerializedEditorState` on every state change                                   | Used internally by `<EditorField>`                            |
| `EditorField`             | Form component    | TanStack Form wrapper around `<Editor>` for `instructions` field                      | `<EditorField />` from `@/components/forms/*`                 |

## 8. Detailed Design

| Concern                            | Entry point                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| Node registry                      | `src/features/recipe/components/editor/extensions.ts` → `recipeNodes`                   |
| Magimix node                       | `src/features/recipe/components/editor/magimix/magimix-program-node.tsx`                |
| Magimix dialog                     | `src/features/recipe/components/editor/magimix/magimix-program-dialog.tsx`              |
| Magimix toolbar button             | `src/features/recipe/components/editor/magimix/magimix-program-button.tsx`              |
| Subrecipe node                     | `src/features/recipe/components/editor/subrecipe/subrecipe-node.tsx`                    |
| Subrecipe dialog                   | `src/features/recipe/components/editor/subrecipe/subrecipe-dialog.tsx`                  |
| Subrecipe toolbar button           | `src/features/recipe/components/editor/subrecipe/subrecipe-button.tsx`                  |
| Magimix data types                 | `src/features/recipe/types/magimix.ts` → `magimixProgram`, `MagimixProgramData`, labels |
| Subrecipe metadata types           | `src/features/recipe/types/subrecipe.ts`                                                |
| Shared editor component            | `src/components/ui/editor/*`                                                            |
| `OnChangePlugin`                   | Bundled in `@/components/ui/editor` package                                             |
| Form field integration             | `src/components/forms/editor-field.tsx` (referenced via `useAppForm`)                   |
| HTML → Lexical migration (one-off) | `scripts/migrate-instructions-to-lexical.ts`                                            |

Serialized shape of a Magimix node (for reference):

```typescript
type SerializedMagimixProgramNode = Spread<
  {
    type: 'magimixProgram'
    version: 1
    program: string
    rotationSpeed: string
    time: number
    temperature?: number
  },
  SerializedLexicalNode
>
```

## 9. Verification Criteria

- `[VC-1]` Typing text in the editor updates the `instructions` field in the parent form (TanStack Form value
  reflects the Lexical state).
- `[VC-2]` Clicking the Magimix toolbar button opens `MagimixProgramDialog`; submitting inserts a
  `MagimixProgramNode` into the document.
- `[VC-3]` Double-clicking an existing Magimix node opens the dialog pre-filled with the node's current data;
  saving replaces the node in place.
- `[VC-4]` The Subrecipe toolbar button lists existing recipes (via `getRecipeListOptions` or equivalent) and
  inserts a `SubrecipeNode` referencing the chosen recipe id.
- `[VC-5]` The same editor in `readOnly` mode renders Magimix and Subrecipe nodes with the same visual layout
  but without dialog triggers / editing affordances.
- `[VC-6]` `recipe.instructions` round-trips: load → mount editor → serialize → save produces an equivalent
  JSON (semantic equality, not byte-identical).
- `[VC-7]` Auto-tag firing for Magimix content: authoring a recipe with at least one `MagimixProgramNode` and
  saving it results in `tags` containing `magimix`. **This VC currently fails** — see caveat `[C-1]`; track via
  `[OQ-1]`. Once the server substring is corrected, re-verify.
- `[VC-8]` Lint + typecheck pass.

## 10. Open Questions

- `[OQ-1]` Fix the Magimix auto-tag substring on the server: `"types":"magimixProgram"` →
  `"type":"magimixProgram"`. Do we need a data migration to re-run auto-tagging on all existing recipes after
  the fix?
- `[OQ-2]` Should we consider Lexical → HTML pre-rendering at write time for email / PDF export, or compute at
  export time?

## Changelog

| Date       | Amendment                               | Sections affected | Reason                                                            |
| ---------- | --------------------------------------- | ----------------- | ----------------------------------------------------------------- |
| 2026-04-11 | Tiptap v3 → Lexical migration           | 3, 7, 8           | Better SSR, decorator nodes, typed JSON serialization             |
| 2026-04-11 | Instructions serialization: HTML → JSON | 3, 6, 8           | Schema column now types `instructions` as `SerializedEditorState` |
