# §08 — Editor: keep Lexical core, custom Solid binding

**Decision (locked): Option A.** Keep `lexical@0.46` core + `@lexical/list|rich-text|utils` (all
framework-neutral). Drop `@lexical/react` (React-only) and replace it with a small hand-rolled Solid
binding. (The community `lexical-solid` was considered and **rejected — unmaintained**, and it pins
`lexical@~0.30` vs our `0.46`.) The persisted format is **unchanged** — instructions stay Lexical JSON in D1, so the
auto-tag detector (`"types":"magimixProgram"`), `api/get-instructions.ts`, and every existing recipe
keep working with **zero data migration**.

Recipe instructions embed custom inline nodes for **Magimix programs** and **subrecipes**
(architecture DAT-002). The editor is client-only (CON-004), which removes SSR/hydration concerns.

## What `@lexical/react` gave us, and the Solid replacement

| `@lexical/react`                                     | We rebuild with                                       |
| ---------------------------------------------------- | ----------------------------------------------------- |
| `<LexicalComposer>` / `createEditor` context         | a Solid `EditorContext` holding the `editor` instance |
| `<RichTextPlugin>` + `ContentEditable`               | a `<div ref>` wired via `editor.setRootElement(el)`   |
| `<OnChangePlugin>`                                   | `editor.registerUpdateListener` → signal → `onChange` |
| `useLexicalComposerContext()`                        | `useContext(EditorContext)`                           |
| `useDecorators()` (React portals for DecoratorNodes) | `render()` each decorator into its node's DOM element |
| `<HistoryPlugin>`, `<ListPlugin>`                    | register the same core commands/nodes manually        |

## Affected files

- `src/components/common/editor/index.tsx` — the composer/root binding (rewrite)
- `src/components/common/editor/plugins/on-change-plugin.tsx` — fold into the root binding
- `src/components/forms/editor-field.tsx` — un-stub (§06), wire to the binding
- `src/features/recipe/components/editor/extensions.ts` — node/command registration (mostly reusable)
- `src/features/recipe/components/editor/subrecipe/{subrecipe-node,subrecipe-button,subrecipe-dialog}.tsx`
- `src/features/recipe/components/editor/magimix/{magimix-program-node,magimix-program-button,magimix-program-dialog}.tsx`
- `src/components/ui/toolbar.tsx` — plain `<div role="toolbar">` (deferred from §04, lives here)

## The binding — concrete shape

### 1. Editor root (`common/editor/index.tsx`)

```tsx
import { createEditor, type LexicalEditor } from 'lexical'
import { createContext, onMount, onCleanup, useContext } from 'solid-js'

const EditorContext = createContext<LexicalEditor>()
export const useEditor = () => useContext(EditorContext)!

export function Editor(props: { initialJSON?: string; onChange?: (json: string) => void; children?: any }) {
  const editor = createEditor({
    namespace: 'recipe-instructions',
    nodes: editorNodes, // from extensions.ts: ListNode, ListItemNode, SubrecipeNode, MagimixProgramNode, ...
    theme: editorTheme, // reuse existing class map
    onError: (e) => {
      throw e
    },
  })

  let root!: HTMLDivElement
  onMount(() => {
    editor.setRootElement(root)
    if (props.initialJSON) editor.setEditorState(editor.parseEditorState(props.initialJSON))
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      props.onChange?.(JSON.stringify(editorState.toJSON())) // same JSON shape as today
    })
    onCleanup(unregister)
  })

  return (
    <EditorContext.Provider value={editor}>
      <div ref={root} contentEditable class="..." /> {/* replaces ContentEditable */}
      {props.children} {/* toolbar, node-render host */}
    </EditorContext.Provider>
  )
}
```

`initialJSON`/`onChange` are exactly the props `editor-field.tsx` needs — the field feeds the
TanStack Form field value in and gets JSON out, unchanged from today's contract. This subsumes the
old `on-change-plugin` (delete that file).

### 2. `extensions.ts` — node & command registration

`editorNodes` array (`ListNode`, `ListItemNode` from `@lexical/list`, `HeadingNode`/`QuoteNode` from
`@lexical/rich-text`, plus the two custom nodes) is framework-neutral — largely reusable. Register
list/history behavior with core: `editor.dispatchCommand`/`registerCommand` and the helpers from
`@lexical/list` (`insertList`, `INSERT_UNORDERED_LIST_COMMAND`) and `@lexical/utils`
(`mergeRegister`). History: `lexical` core exposes `registerHistory(editor, createEmptyHistoryState(), delay)`
— call it in `onMount`, `onCleanup` the returned unregister.

### 3. Decorator nodes (subrecipe / magimix) — the only tricky part

`@lexical/react` renders `DecoratorNode.decorate()` return values as React portals via
`useDecorators`. With core Lexical, `decorate()` returns whatever we want and _we_ mount it. Solid
approach — each decorator node renders a Solid component into the DOM element Lexical created for it:

```tsx
// subrecipe-node.tsx
import { DecoratorNode } from 'lexical'
import { render } from 'solid-js/web'

export class SubrecipeNode extends DecoratorNode<HTMLElement> {
  // ...static getType/clone/importJSON/exportJSON UNCHANGED (this is what keeps the data format) ...
  createDOM() {
    return document.createElement('span')
  } // host element
  updateDOM() {
    return false
  }
  decorate(): HTMLElement {
    const el = document.createElement('span')
    const dispose = render(() => <SubrecipeView recipeId={this.__recipeId} />, el)
    // Lexical owns the node lifecycle; dispose on node removal:
    // register a one-shot cleanup via the editor's mutation listener keyed on this node,
    // or track disposers in a WeakMap<HTMLElement, () => void> cleaned in the root onCleanup.
    return el
  }
}
```

`importJSON`/`exportJSON`/`getType` on both custom nodes **must stay byte-identical** to the current
implementations — they define the persisted JSON the tag detector reads. Only `decorate()` (the
render path) changes from returning a React element to mounting a Solid component.

The `render()` disposer bookkeeping is the one bit of real care: keep a `WeakMap<HTMLElement,
Dispose>` in the editor context and dispose in the root's `onCleanup`, plus on node destroy via
`editor.registerMutationListener(SubrecipeNode, ...)` for `destroyed` mutations. **This is the one
piece to unit-test** (mount → node removed → Solid tree disposed, no leak).

### 4. Dialogs & buttons

`subrecipe-dialog.tsx` / `magimix-program-dialog.tsx` use the §04 Dialog wrapper (Kobalte dialog /
corvu drawer). `*-button.tsx` dispatch a Lexical command via `useEditor()` to insert the node:
`editor.update(() => $insertNodes([$createSubrecipeNode(id)]))`. Pure §03 port + `useEditor()`.

### 5. Toolbar (`ui/toolbar.tsx`)

`<div role="toolbar">` with buttons calling `editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')`
etc. via `useEditor()`. **Include roving-tabindex** (~30 lines: one tab stop, arrow keys move focus
across buttons) — replaces the a11y Base UI `Toolbar` gave us; don't ship a bare div.

## Build order (spike → features)

1. **Core round-trip** (do first, week 1): `Editor` mounts, typing works, `onChange` emits JSON, and
   `initialJSON` from a real stored recipe re-hydrates. **Gate:** diff a real recipe's stored JSON
   before/after an edit-noop — must be identical shape.
2. **Lists + history + toolbar** — register core list/history, wire toolbar buttons.
3. **SubrecipeNode** decorator (prove the `render()`-into-DOM + disposer pattern).
4. **MagimixProgramNode** decorator (same pattern, second instance confirms it generalizes).
5. Un-stub `editor-field.tsx`; recipe create/edit instructions back online.

## Validation

- Round-trip: open an existing recipe with a magimix program + subrecipe, edit unrelated text, save
  → stored JSON's custom-node blocks unchanged; tag detector still flags magimix (AC path).
- Insert a new subrecipe and magimix program via toolbar/dialog → renders live, persists, reloads.
- **Leak test** (the one required unit test): mount editor with N decorator nodes, remove them,
  assert every Solid disposer ran (no orphaned effects/DOM).
- Bold/italic/list formatting via toolbar dispatches and persists.

## ponytail notes

- Reuse the custom nodes' `importJSON`/`exportJSON`/`getType` verbatim — touching them means a data
  migration, which is the whole reason we chose this option.
- One disposer WeakMap + one leak test. Don't build a general "Solid decorator framework"; two nodes
  share ~10 lines of mount/dispose glue.
- Toolbar keeps roving-tabindex (~30 lines) — the one a11y behavior worth preserving from Base UI's
  Toolbar; everything else stays minimal.
