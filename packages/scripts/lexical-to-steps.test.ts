import { recipeStepSchema } from '@recipe-organizer/shared/recipe/schemas'
import { describe, expect, it } from 'vite-plus/test'

import { convertRecipes } from './lexical-to-steps'

const text = (value: string, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: value, type: 'text', version: 1 })
const paragraph = (...children: object[]) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 })
const listItem = (...children: object[]) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'listitem', value: 1, version: 1 })
const list = (...children: object[]) => ({
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  listType: 'number',
  start: 1,
  tag: 'ol',
  type: 'list',
  version: 1,
})
const magimix = (data: { program: string; rotationSpeed: string; temperature: number | null; time: number }) => ({
  children: [],
  format: '',
  type: 'magimixProgram',
  version: 1,
  ...data,
})
const subrecipe = (recipeId: number, hideFirstNodes: number, hideLastNodes: number) => ({
  hideFirstNodes,
  hideLastNodes,
  recipeId,
  type: 'subrecipe',
  version: 1,
})
const doc = (...children: object[]) => JSON.stringify({ root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } })

const convertOne = (instructions: string) => convertRecipes([{ id: 1, instructions }])

describe('convertRecipes', () => {
  it('converts bold text to ** and merges adjacent bold runs', () => {
    const { steps } = convertOne(doc(paragraph(text('Mélanger '), text('vive', 1), text('ment', 1), text(' et '), text(' chaud ', 1), text('.'))))
    expect(steps.get(1)).toEqual([{ kind: 'text', text: 'Mélanger **vivement** et  **chaud** .' }])
  })

  it('keeps line breaks and reports dropped formats', () => {
    const { report, steps } = convertOne(doc(paragraph(text('ligne 1', 2), { type: 'linebreak', version: 1 }, text('ligne 2'))))
    expect(steps.get(1)).toEqual([{ kind: 'text', text: 'ligne 1\nligne 2' }])
    expect(report).toEqual([{ issue: 'dropped text format 2', recipeId: 1 }])
  })

  it('splits a list into one step per item, including nested items', () => {
    const { steps } = convertOne(doc(list(listItem(text('Couper')), listItem(list(listItem(text('Saler')))), listItem(text('Cuire')))))
    expect(steps.get(1)?.map((step) => step.kind === 'text' && step.text)).toEqual(['Couper', 'Saler', 'Cuire'])
  })

  it('skips empty paragraphs and empty documents', () => {
    expect(convertOne(doc(paragraph(), paragraph(text('  ')), paragraph(text('Servir')))).steps.get(1)).toEqual([{ kind: 'text', text: 'Servir' }])
    expect(convertOne('').steps.get(1)).toEqual([])
  })

  it('maps Magimix nodes and adjusts invalid values', () => {
    const { report, steps } = convertOne(
      doc(
        magimix({ program: 'expert', rotationSpeed: '4', temperature: 95, time: 180 }),
        magimix({ program: 'soup', rotationSpeed: '4', temperature: null, time: 0 })
      )
    )
    expect(steps.get(1)).toEqual([
      { kind: 'magimix', program: 'expert', rotationSpeed: '4', temperature: 95, time: 180 },
      { kind: 'magimix', program: 'expert', rotationSpeed: '4', time: 1 },
    ])
    expect(report).toHaveLength(1)
  })

  it('maps hide counts to a step range across a split list', () => {
    // Source nodes → steps: [0] 1 · [1] 2,3,4 · [2] 5 · [3] trailing empty paragraph.
    const source = doc(
      paragraph(text('Un')),
      list(listItem(text('Deux')), listItem(text('Trois')), listItem(text('Quatre'))),
      paragraph(text('Cinq')),
      paragraph()
    )
    const { report, steps } = convertRecipes([
      { id: 1, instructions: doc(subrecipe(2, 1, 1)) },
      { id: 2, instructions: source },
      { id: 3, instructions: doc(subrecipe(2, 0, 0)) },
      { id: 4, instructions: doc(subrecipe(2, 0, 2)) },
    ])
    expect(steps.get(1)).toEqual([{ fromStep: 2, kind: 'subrecipe', recipeId: 2, toStep: 4 }])
    expect(steps.get(3)).toEqual([{ kind: 'subrecipe', recipeId: 2 }])
    expect(steps.get(4)).toEqual([{ kind: 'subrecipe', recipeId: 2, toStep: 1 }])
    expect(report).toEqual([])
  })

  it('keeps the legacy hidden last node, empty ranges, and drops missing sources', () => {
    const { report, steps } = convertRecipes([
      { id: 1, instructions: doc(subrecipe(2, 0, 0), subrecipe(2, 2, 0), subrecipe(9, 0, 0)) },
      { id: 2, instructions: doc(paragraph(text('Un')), paragraph(text('Deux'))) },
    ])
    expect(steps.get(1)).toEqual([
      { kind: 'subrecipe', recipeId: 2, toStep: 1 },
      { fromStep: 3, kind: 'subrecipe', recipeId: 2, toStep: 3 },
    ])
    expect(report.map((entry) => entry.issue)).toEqual([
      "sub-recipe 2: legacy renderer also hid the source's last node; kept hidden",
      "sub-recipe 2: empty range; points past the source's last step",
      'sub-recipe 9 does not exist; step dropped',
    ])
  })

  it('converts unknown nodes to text and reports them', () => {
    const { report, steps } = convertOne(
      doc({ children: [text('const x')], type: 'code', version: 1 }, paragraph({ children: [text('lien')], type: 'link', url: 'x', version: 1 }))
    )
    expect(steps.get(1)).toEqual([
      { kind: 'text', text: 'const x' },
      { kind: 'text', text: 'lien' },
    ])
    expect(report.map((entry) => entry.issue)).toEqual(['unknown node "code" converted to text', 'unknown inline node "link" converted to text'])
  })

  it('produces steps that satisfy recipeStepSchema', () => {
    const { steps } = convertRecipes([
      {
        id: 1,
        instructions: doc(
          paragraph(text('Bold', 1)),
          magimix({ program: 'x', rotationSpeed: 'y', temperature: 500, time: 9999 }),
          subrecipe(2, 1, 0)
        ),
      },
      { id: 2, instructions: doc(paragraph(text('a')), paragraph(text('b')), paragraph(text('c'))) },
      { id: 3, instructions: 'pas du JSON' },
    ])
    for (const step of [...steps.values()].flat()) {
      expect(recipeStepSchema.parse(step)).toEqual(step)
    }
  })
})
