import { type RecipeStep } from '@recipe-organizer/shared/recipe/schemas'
import { describe, expect, it } from 'vite-plus/test'

import { assertSubrecipeSteps, rowsToSteps, stepsToRows } from './recipe-steps'
import { computeAutoFlags } from './recipe-write'

const steps: RecipeStep[] = [
  { kind: 'text', text: 'Mélanger **vivement**.' },
  { kind: 'magimix', program: 'expert', rotationSpeed: '4', temperature: 95, time: 180 },
  { fromStep: 2, kind: 'subrecipe', recipeId: 7 },
  { kind: 'magimix', program: 'robot', rotationSpeed: 'auto', time: 60 },
  { kind: 'text', text: 'Servir.' },
]

describe('step rows', () => {
  it('assigns contiguous positions across tables', () => {
    const rows = stepsToRows(steps)
    expect([...rows.text, ...rows.magimix, ...rows.subrecipe].map((row) => row.position).toSorted((left, right) => left - right)).toEqual([
      1, 2, 3, 4, 5,
    ])
    expect(rows.subrecipe).toEqual([{ fromStep: 2, position: 3, subrecipeId: 7, toStep: null }])
  })

  it('round-trips steps in order', () => {
    const rows = stepsToRows(steps)
    expect(rowsToSteps({ magimix: rows.magimix.toReversed(), subrecipe: rows.subrecipe, text: rows.text })).toEqual(steps)
  })
})

describe('assertSubrecipeSteps', () => {
  it('accepts a sub-recipe from the linked recipes', () => {
    expect(() => assertSubrecipeSteps(steps, [7], 1)).not.toThrow()
  })

  it.each([
    { linked: [8], recipeId: 1 },
    { linked: [7], recipeId: 7 },
  ])('rejects a sub-recipe outside links or pointing to itself (%o)', ({ linked, recipeId }) => {
    expect(() => assertSubrecipeSteps(steps, linked, recipeId)).toThrow()
  })
})

describe('computeAutoFlags', () => {
  it('derives isMagimix from a magimix step', () => {
    expect(computeAutoFlags([], [], steps, []).isMagimix).toBe(true)
    expect(computeAutoFlags([], [], [{ kind: 'text', text: 'magimixProgram' }], []).isMagimix).toBe(false)
  })
})
