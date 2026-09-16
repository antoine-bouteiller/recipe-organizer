import { createEditor } from 'lexical'

import { MagimixProgramNode } from './magimix/magimix-program-node'
import { SubrecipeNode } from './subrecipe/subrecipe-node'

declare const expect: (value: unknown) => { toMatchObject: (expected: unknown) => void }
declare const it: (name: string, callback: () => void) => void

const state = JSON.stringify({
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        program: 'soup',
        rotationSpeed: '4',
        temperature: 95,
        time: 180,
        type: 'magimixProgram',
        version: 1,
      },
      { children: [], direction: null, format: '', hideFirstNodes: 1, hideLastNodes: 2, indent: 0, recipeId: 42, type: 'subrecipe', version: 1 },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})

it('round-trips recipe decorator JSON attributes', () => {
  const editor = createEditor({ nodes: [MagimixProgramNode, SubrecipeNode] })
  editor.setEditorState(editor.parseEditorState(state))

  expect(editor.getEditorState().toJSON()).toMatchObject({
    root: {
      children: [
        { program: 'soup', rotationSpeed: '4', temperature: 95, time: 180, type: 'magimixProgram' },
        { hideFirstNodes: 1, hideLastNodes: 2, recipeId: 42, type: 'subrecipe' },
      ],
    },
  })
})
