import type { RecipeStepGroup } from '@recipe-organizer/shared/recipe/schemas'
import { describe, expect, it } from 'vite-plus/test'

import { assertSubrecipeGroups, flattenSteps, rowsToStepGroups } from './recipe-steps'
import { computeAutoFlags } from './recipe-write'

const stepGroups: RecipeStepGroup[] = [
  {
    kind: 'steps',
    steps: [
      { kind: 'text', text: 'Mélanger **vivement**.' },
      { kind: 'magimix', program: 'expert', rotationSpeed: '4', temperature: 95, time: 180 },
    ],
  },
  { kind: 'subrecipe', recipeId: 7 },
  { groupName: 'Finition', kind: 'steps', steps: [{ kind: 'text', text: 'Servir.' }] },
]

describe('rowsToStepGroups', () => {
  it('maps group and kind rows to step groups', () => {
    expect(
      rowsToStepGroups([
        {
          groupName: null,
          steps: [
            { magimix: null, text: { text: 'Mélanger **vivement**.' } },
            { magimix: { program: 'expert', rotationSpeed: '4', temperature: 95, time: 180 }, text: null },
          ],
          subrecipeId: null,
        },
        { groupName: null, steps: [], subrecipeId: 7 },
        { groupName: 'Finition', steps: [{ magimix: null, text: { text: 'Servir.' } }], subrecipeId: null },
      ])
    ).toEqual(stepGroups)
  })
})

describe('assertSubrecipeGroups', () => {
  it('accepts a sub-recipe from the linked recipes', () => {
    expect(() => assertSubrecipeGroups(stepGroups, [7], 1)).not.toThrow()
  })

  it.each([
    { linked: [8], recipeId: 1 },
    { linked: [7], recipeId: 7 },
  ])('rejects a sub-recipe outside links or pointing to itself (%o)', ({ linked, recipeId }) => {
    expect(() => assertSubrecipeGroups(stepGroups, linked, recipeId)).toThrow()
  })
})

describe('computeAutoFlags', () => {
  it('derives isMagimix from a magimix step', () => {
    expect(computeAutoFlags([], [], flattenSteps(stepGroups), []).isMagimix).toBe(true)
    expect(computeAutoFlags([], [], [{ kind: 'text', text: 'magimixProgram' }], []).isMagimix).toBe(false)
  })
})
