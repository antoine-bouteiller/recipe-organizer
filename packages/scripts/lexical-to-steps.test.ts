import { recipeSchema } from '@recipe-organizer/shared/recipe/schemas'
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

const convertOne = (instructions: string) => {
  const { report, stepGroups } = convertRecipes([{ id: 1, instructions }])
  const [group] = stepGroups.get(1) ?? []
  return { report, steps: new Map([[1, group?.kind === 'steps' ? group.steps : undefined]]) }
}

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

  it('splits steps around sub-recipe groups and drops missing sources', () => {
    const { report, stepGroups } = convertRecipes([
      { id: 1, instructions: doc(subrecipe(2, 0, 0), paragraph(text('Un')), subrecipe(2, 1, 0), subrecipe(9, 0, 0), paragraph(text('Deux'))) },
      { id: 2, instructions: doc(paragraph(text('Source'))) },
    ])
    expect(stepGroups.get(1)).toEqual([
      { kind: 'steps', steps: [] },
      { kind: 'subrecipe', recipeId: 2 },
      { kind: 'steps', steps: [{ kind: 'text', text: 'Un' }] },
      { kind: 'subrecipe', recipeId: 2 },
      { kind: 'steps', steps: [{ kind: 'text', text: 'Deux' }] },
    ])
    expect(report.map((entry) => entry.issue)).toEqual([
      "sub-recipe 2: legacy hidden range dropped; group shows the source's default group",
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

  it('produces step groups that satisfy the recipe schema', () => {
    const { stepGroups } = convertRecipes([
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
    for (const groups of stepGroups.values()) {
      const input = groups.map((group) =>
        group.kind === 'steps' ? { ...group, _key: 'k', steps: group.steps.map((step) => ({ ...step, _key: 'k' })) } : { ...group, _key: 'k' }
      )
      expect(recipeSchema.shape.stepGroups.parse(input)).toEqual(input)
    }
  })
})
