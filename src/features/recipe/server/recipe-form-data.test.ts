import { describe, expect, it } from 'vite-plus/test'
import { ValidationError } from 'void/pages-protocol'

import { recipeSchema } from '@/features/recipe/schemas'

import { readRecipeFormData, validateRecipeForm } from './recipe-form-data'

const read = (init: RequestInit) => {
  const request = new Request('http://localhost/', { ...init, method: 'POST' })
  return readRecipeFormData({
    req: { formData: () => request.formData(), header: (name) => request.headers.get(name) ?? undefined, json: () => request.json() },
  })
}

const values = {
  ingredientGroups: [{ _key: 'ingredients', ingredients: [{ _key: 'ingredient', id: 3, quantity: 2 }] }],
  name: 'Recette test',
  servings: 4,
  stepGroups: [{ _key: 'group', kind: 'steps', steps: [{ _key: 'step', text: 'Mélanger.' }] }],
}

describe('readRecipeFormData', () => {
  it('decodes structured values sent as a no-file JSON page action', async () => {
    expect(await read({ body: JSON.stringify(values), headers: { 'Content-Type': 'application/json' } })).toEqual(values)
  })

  it('keeps uploaded files while decoding structured multipart fields', async () => {
    const image = new File(['image bytes'], 'recipe.png', { type: 'image/png' })
    const body = new FormData()
    body.append('name', values.name)
    body.append('servings', '4')
    body.append('image', image)
    body.append('ingredientGroups[0][_key]', 'ingredients')
    body.append('ingredientGroups[0][ingredients][0][_key]', 'ingredient')
    body.append('ingredientGroups[0][ingredients][0][id]', '3')
    body.append('ingredientGroups[0][ingredients][0][quantity]', '2')
    body.append('stepGroups[0][_key]', 'group')
    body.append('stepGroups[0][kind]', 'steps')
    body.append('stepGroups[0][steps][0][_key]', 'step')
    body.append('stepGroups[0][steps][0][text]', 'Mélanger.')
    body.append('video', '')
    expect(await read({ body })).toEqual({
      ...values,
      cuisineTypes: [],
      image: expect.objectContaining({ name: 'recipe.png', size: image.size, type: 'image/png' }),
      linkedRecipes: [],
      meals: [],
    })
  })
})

describe('recipe form validation', () => {
  const valid = { ...values, cuisineTypes: [], image: { id: 'photo', url: 'photo' }, meals: [] }
  it('keeps JSON validation strict and projects numeric errors by dotted field path', () => {
    try {
      validateRecipeForm(recipeSchema, {
        ...valid,
        ingredientGroups: [{ _key: 'group', ingredients: [{ _key: 'ingredient', id: 3, quantity: '' }] }],
        servings: '4',
      })
      expect.unreachable('Expected validation failure')
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      if (!(error instanceof ValidationError)) {
        throw error
      }
      expect(error.errors).toEqual({ 'ingredientGroups.0.ingredients.0.quantity': expect.any(String), servings: expect.any(String) })
    }
  })

  it('restores empty multipart collections without changing asset ids or blank optional values', async () => {
    const body = new FormData()
    body.append('name', 'Empty recipe')
    body.append('servings', '4')
    body.append('image[id]', '42')
    body.append('image[url]', 'photo')
    body.append('video', '')
    body.append('ingredientGroups[0][_key]', 'ingredients')
    body.append('stepGroups[0][_key]', 'group')
    body.append('stepGroups[0][kind]', 'steps')
    body.append('stepGroups[0][groupName]', '')
    expect(validateRecipeForm(recipeSchema, await read({ body }))).toEqual({
      cuisineTypes: [],
      image: { id: '42', url: 'photo' },
      ingredientGroups: [{ _key: 'ingredients', ingredients: [] }],
      linkedRecipes: [],
      meals: [],
      name: 'Empty recipe',
      servings: 4,
      stepGroups: [{ _key: 'group', kind: 'steps', steps: [] }],
    })
  })
})
