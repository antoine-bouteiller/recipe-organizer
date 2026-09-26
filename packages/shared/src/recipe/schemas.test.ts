import { describe, expect, it } from 'vite-plus/test'

import { recipeStepSchema } from './schemas'

const validSteps = [
  { kind: 'text', text: 'Mélanger **vivement**.' },
  { kind: 'magimix', program: 'expert', rotationSpeed: '4', temperature: 95, time: 180 },
  { kind: 'magimix', program: 'robot', rotationSpeed: 'auto', time: 60 },
  { fromStep: 2, kind: 'subrecipe', recipeId: 7, toStep: 4 },
  { kind: 'subrecipe', recipeId: 7 },
]

describe('recipeStepSchema', () => {
  it.each(validSteps)('parses a valid $kind step unchanged', (step) => {
    expect(recipeStepSchema.parse(step)).toEqual(step)
  })

  it.each([
    { kind: 'text' },
    { kind: 'text', text: '   ' },
    { kind: 'magimix', program: 'expert', time: 60 },
    { kind: 'subrecipe' },
    { kind: 'video', url: 'x' },
    { kind: 'magimix', program: 'expert', rotationSpeed: '4', temperature: 201, time: 60 },
    { kind: 'magimix', program: 'soup', rotationSpeed: '4', time: 60 },
    { fromStep: 4, kind: 'subrecipe', recipeId: 7, toStep: 2 },
  ])('rejects %o', (step) => {
    expect(recipeStepSchema.safeParse(step).success).toBe(false)
  })
})
