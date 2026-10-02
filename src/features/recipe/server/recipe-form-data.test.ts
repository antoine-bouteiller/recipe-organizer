import { Hono } from 'hono'
import { describe, expect, it } from 'vite-plus/test'
import type { CloudEnv } from 'void'

import { objectToFormData } from '@/utils/form-data'

import { readRecipeFormData } from './recipe-form-data'

const app = new Hono<CloudEnv>()
app.post('/', async (context): Promise<Response> => {
  const data = await readRecipeFormData(context)
  const { image } = data
  if (image instanceof File) {
    return context.json({ ...data, image: { name: image.name, text: await image.text(), type: image.type } })
  }
  return context.json(data)
})

const values = {
  ingredientGroups: [{ _key: 'ingredients', ingredients: [{ _key: 'ingredient', id: 3, quantity: 2 }] }],
  name: 'Recette test',
  servings: 4,
  stepGroups: [{ _key: 'group', kind: 'steps', steps: [{ _key: 'step', text: 'Mélanger.' }] }],
}

describe('readRecipeFormData', () => {
  it('decodes structured values sent as a no-file JSON page action', async () => {
    const response = await app.request('/', {
      body: JSON.stringify(Object.fromEntries(objectToFormData(values))),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(values)
  })

  it('keeps uploaded files while decoding structured multipart fields', async () => {
    const image = new File(['image bytes'], 'recipe.png', { type: 'image/png' })
    const response = await app.request('/', { body: objectToFormData({ ...values, image }), method: 'POST' })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ...values, image: { name: 'recipe.png', text: 'image bytes', type: 'image/png' } })
  })
})
