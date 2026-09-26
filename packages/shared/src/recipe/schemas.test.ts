import { describe, expect, it } from 'vite-plus/test'

import { recipeSchema, recipeStepSchema } from './schemas'

const validSteps = [
  { text: 'Mélanger **vivement**.' },
  { magimix: { program: 'expert', rotationSpeed: '4', temperature: 95, time: 180 }, text: 'Lancer.' },
  { magimix: { program: 'robot', rotationSpeed: 'auto', time: 60 }, text: 'Hacher.' },
]

describe('recipeStepSchema', () => {
  it.each(validSteps)('parses a valid step unchanged (%o)', (step) => {
    expect(recipeStepSchema.parse(step)).toEqual(step)
  })

  it.each([
    {},
    { text: '   ' },
    { magimix: { program: 'expert', rotationSpeed: '4', time: 60 } },
    { magimix: { program: 'expert', time: 60 }, text: 'Lancer.' },
    { magimix: { program: 'expert', rotationSpeed: '4', temperature: 201, time: 60 }, text: 'Lancer.' },
    { magimix: { program: 'soup', rotationSpeed: '4', time: 60 }, text: 'Lancer.' },
  ])('rejects %o', (step) => {
    expect(recipeStepSchema.safeParse(step).success).toBe(false)
  })
})

describe('recipeSchema.stepGroups', () => {
  const ownGroup = { _key: 'a', kind: 'steps', steps: [{ _key: 'b', text: 'Servir.' }] }
  const subrecipeGroup = { _key: 'c', kind: 'subrecipe', recipeId: 7 }

  it('requires the first group to own steps', () => {
    expect(recipeSchema.shape.stepGroups.safeParse([ownGroup, subrecipeGroup]).success).toBe(true)
    expect(recipeSchema.shape.stepGroups.safeParse([subrecipeGroup, ownGroup]).success).toBe(false)
    expect(recipeSchema.shape.stepGroups.safeParse([]).success).toBe(false)
  })
})
