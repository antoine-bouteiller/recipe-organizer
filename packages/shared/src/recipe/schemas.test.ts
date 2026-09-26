import { describe, expect, it } from 'vite-plus/test'

import { recipeSchema, recipeStepSchema } from './schemas'

const validSteps = [
  { kind: 'text', text: 'Mélanger **vivement**.' },
  { kind: 'magimix', program: 'expert', rotationSpeed: '4', temperature: 95, time: 180 },
  { kind: 'magimix', program: 'robot', rotationSpeed: 'auto', time: 60 },
]

describe('recipeStepSchema', () => {
  it.each(validSteps)('parses a valid $kind step unchanged', (step) => {
    expect(recipeStepSchema.parse(step)).toEqual(step)
  })

  it.each([
    { kind: 'text' },
    { kind: 'text', text: '   ' },
    { kind: 'magimix', program: 'expert', time: 60 },
    { kind: 'subrecipe', recipeId: 7 },
    { kind: 'video', url: 'x' },
    { kind: 'magimix', program: 'expert', rotationSpeed: '4', temperature: 201, time: 60 },
    { kind: 'magimix', program: 'soup', rotationSpeed: '4', time: 60 },
  ])('rejects %o', (step) => {
    expect(recipeStepSchema.safeParse(step).success).toBe(false)
  })
})

describe('recipeSchema.stepGroups', () => {
  const ownGroup = { _key: 'a', kind: 'steps', steps: [{ _key: 'b', kind: 'text', text: 'Servir.' }] }
  const subrecipeGroup = { _key: 'c', kind: 'subrecipe', recipeId: 7 }

  it('requires the first group to own steps', () => {
    expect(recipeSchema.shape.stepGroups.safeParse([ownGroup, subrecipeGroup]).success).toBe(true)
    expect(recipeSchema.shape.stepGroups.safeParse([subrecipeGroup, ownGroup]).success).toBe(false)
    expect(recipeSchema.shape.stepGroups.safeParse([]).success).toBe(false)
  })
})
