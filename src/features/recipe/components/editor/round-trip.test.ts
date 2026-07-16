import { $createParagraphNode, $createTextNode, $getRoot, createEditor, type LexicalEditor } from 'lexical'
import { describe, expect, it } from 'vite-plus/test'

import { recipeNodes } from './extensions'
import { $createMagimixProgramNode } from './magimix/magimix-program-node'
import { $createSubrecipeNode } from './subrecipe/subrecipe-node'

const buildEditor = (): LexicalEditor =>
  createEditor({
    namespace: 'round-trip-test',
    nodes: [...recipeNodes],
    onError: (error) => {
      throw error
    },
  })

const serialize = (editor: LexicalEditor): string => JSON.stringify(editor.getEditorState().toJSON())

describe('recipe editor nodes round-trip', () => {
  it('preserves magimix + subrecipe nodes and the magimix marker across parse/export', () => {
    const editor = buildEditor()
    editor.update(
      () => {
        const root = $getRoot()
        const paragraph = $createParagraphNode()
        paragraph.append($createTextNode('Mélanger'))
        root.append(paragraph)
        root.append($createMagimixProgramNode({ program: 'expert', rotationSpeed: 'auto', temperature: 100, time: 150 }))
        root.append($createSubrecipeNode({ hideFirstNodes: 1, hideLastNodes: 2, recipeId: 42 }))
      },
      { discrete: true }
    )

    const first = serialize(editor)
    expect(first).toContain('"type":"magimixProgram"')

    const reloaded = buildEditor()
    reloaded.setEditorState(reloaded.parseEditorState(first))

    expect(serialize(reloaded)).toBe(first)
  })
})
