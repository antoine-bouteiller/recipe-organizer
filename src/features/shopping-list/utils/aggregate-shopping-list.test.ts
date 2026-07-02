import { type UnitSlug } from '@schema'
import { describe, expect, it } from 'vite-plus/test'

import { type IngredientCategory } from '@/types/ingredient'

import { aggregateShoppingList, type ShoppingListIngredient, type ShoppingListRecipe } from './aggregate-shopping-list'

const makeIngredient = (overrides: Partial<ShoppingListIngredient> & Pick<ShoppingListIngredient, 'id'>): ShoppingListIngredient => ({
  category: 'other',
  countWeightG: null,
  densityGPerMl: null,
  name: `ingredient-${overrides.id}`,
  parentId: null,
  preferredUnitSlug: null,
  quantity: 0,
  unitSlug: 'g' as UnitSlug,
  ...overrides,
})

const makeRecipe = (overrides: Partial<ShoppingListRecipe> & Pick<ShoppingListRecipe, 'id'>): ShoppingListRecipe => ({
  ingredients: [],
  servings: 4,
  ...overrides,
})

describe('aggregateShoppingList', () => {
  it('scales ingredient quantities by the wanted servings', () => {
    const recipe = makeRecipe({ id: 1, ingredients: [makeIngredient({ id: 10, quantity: 100 })], servings: 4 })

    const result = aggregateShoppingList([recipe], { 1: 8 })

    expect(result.other?.[0].primary).toEqual({ quantity: 200, unitSlug: 'g' })
  })

  it('falls back to base servings when no quantity override is set', () => {
    const recipe = makeRecipe({ id: 1, ingredients: [makeIngredient({ id: 10, quantity: 100 })], servings: 4 })

    const result = aggregateShoppingList([recipe], {})

    expect(result.other?.[0].primary.quantity).toBe(100)
  })

  it('merges the same ingredient across recipes', () => {
    const recipeA = makeRecipe({ id: 1, ingredients: [makeIngredient({ id: 10, quantity: 100 })], servings: 4 })
    const recipeB = makeRecipe({ id: 2, ingredients: [makeIngredient({ id: 10, quantity: 50 })], servings: 4 })

    const result = aggregateShoppingList([recipeA, recipeB], {})

    expect(result.other?.[0].primary.quantity).toBe(150)
  })

  it('converts compatible units into the primary unit', () => {
    const recipe = makeRecipe({
      id: 1,
      ingredients: [makeIngredient({ id: 10, quantity: 500, unitSlug: 'g' }), makeIngredient({ id: 10, quantity: 1, unitSlug: 'kg' })],
      servings: 4,
    })

    const result = aggregateShoppingList([recipe], {})

    expect(result.other?.[0].primary).toEqual({ quantity: 1500, unitSlug: 'g' })
    expect(result.other?.[0].fallback).toEqual([])
  })

  it('keeps incompatible units as a separate fallback line', () => {
    const recipe = makeRecipe({
      id: 1,
      ingredients: [makeIngredient({ id: 10, quantity: 200, unitSlug: 'g' }), makeIngredient({ id: 10, quantity: 3, unitSlug: 'piece' })],
      servings: 4,
    })

    const result = aggregateShoppingList([recipe], {})

    expect(result.other?.[0].primary).toEqual({ quantity: 200, unitSlug: 'g' })
    expect(result.other?.[0].fallback).toEqual([{ quantity: 3, unitSlug: 'piece' }])
  })

  it('uses the preferred unit as the primary target', () => {
    const recipe = makeRecipe({
      id: 1,
      ingredients: [makeIngredient({ id: 10, preferredUnitSlug: 'kg', quantity: 2000, unitSlug: 'g' })],
      servings: 4,
    })

    const result = aggregateShoppingList([recipe], {})

    expect(result.other?.[0].primary).toEqual({ quantity: 2, unitSlug: 'kg' })
  })

  it('inflates a parent from its children using the max and hides the children', () => {
    const recipe = makeRecipe({
      id: 1,
      ingredients: [
        makeIngredient({ id: 1, quantity: 200 }),
        makeIngredient({ id: 2, parentId: 1, quantity: 300 }),
        makeIngredient({ id: 3, parentId: 1, quantity: 100 }),
      ],
      servings: 4,
    })

    const result = aggregateShoppingList([recipe], {})

    expect(result.other).toHaveLength(1)
    expect(result.other?.[0].id).toBe(1)
    expect(result.other?.[0].primary.quantity).toBe(500)
  })

  it('groups results by category', () => {
    const recipe = makeRecipe({
      id: 1,
      ingredients: [
        makeIngredient({ category: 'meat', id: 10, quantity: 100 }),
        makeIngredient({ category: 'vegetables' as IngredientCategory, id: 20, quantity: 100 }),
      ],
      servings: 4,
    })

    const result = aggregateShoppingList([recipe], {})

    expect(result.meat).toHaveLength(1)
    expect(result.vegetables).toHaveLength(1)
  })
})
