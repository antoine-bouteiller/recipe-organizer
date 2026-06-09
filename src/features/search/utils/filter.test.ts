import { describe, expect, it } from 'vite-plus/test'

import { type ReducedRecipe } from '@/features/recipe/api/get-all'

import { EMPTY_FILTERS, filterRecipes, hasActiveFilters, type SearchFilters } from './filter'

const recipes: ReducedRecipe[] = [
  {
    cuisineTypes: ['french'],
    id: 1,
    image: '',
    isMagimix: false,
    isSpice: false,
    isVegetarian: false,
    meals: ['dessert'],
    name: 'Crème brûlée',
    servings: 4,
  },
  { cuisineTypes: ['italian'], id: 2, image: '', isMagimix: false, isSpice: false, isVegetarian: true, meals: [], name: 'Pesto pasta', servings: 2 },
  { cuisineTypes: ['french'], id: 3, image: '', isMagimix: true, isSpice: false, isVegetarian: false, meals: [], name: 'Steak frites', servings: 2 },
  { cuisineTypes: [], id: 4, image: '', isMagimix: false, isSpice: true, isVegetarian: true, meals: [], name: 'Mélange épices', servings: 1 },
]

const filters = (overrides: Partial<SearchFilters>): SearchFilters => ({ ...EMPTY_FILTERS, ...overrides })

const ids = (result: ReducedRecipe[]) => result.map((recipe) => recipe.id)

describe('filterRecipes', () => {
  it('matches names accent- and case-insensitively', () => {
    expect(ids(filterRecipes(recipes, filters({ query: 'CREME' })))).toEqual([1])
  })

  it('returns every recipe for an empty query', () => {
    expect(ids(filterRecipes(recipes, filters({ query: '' })))).toEqual([1, 2, 3])
  })

  it('ignores a whitespace-only query', () => {
    expect(ids(filterRecipes(recipes, filters({ query: '   ' })))).toEqual([1, 2, 3])
  })

  it('filters by the vegetarian flag', () => {
    expect(ids(filterRecipes(recipes, filters({ isVegetarian: true })))).toEqual([2])
  })

  it('filters by the magimix flag', () => {
    expect(ids(filterRecipes(recipes, filters({ isMagimix: true })))).toEqual([3])
  })

  it('filters by a cuisine type', () => {
    expect(ids(filterRecipes(recipes, filters({ cuisineTypes: ['french'] })))).toEqual([1, 3])
  })

  it('filters by a meal', () => {
    expect(ids(filterRecipes(recipes, filters({ meals: ['dessert'] })))).toEqual([1])
  })

  it('AND-combines a cuisine type and the vegetarian flag', () => {
    expect(ids(filterRecipes(recipes, filters({ cuisineTypes: ['italian'], isVegetarian: true })))).toEqual([2])
  })

  it('returns no match when filters cannot co-occur', () => {
    expect(filterRecipes(recipes, filters({ cuisineTypes: ['italian'], meals: ['dessert'] }))).toEqual([])
  })

  it('combines query and filter predicates', () => {
    expect(ids(filterRecipes(recipes, filters({ cuisineTypes: ['french'], query: 'steak' })))).toEqual([3])
  })

  it('hides spice recipes by default', () => {
    expect(ids(filterRecipes(recipes, filters({})))).toEqual([1, 2, 3])
  })

  it('reveals spice recipes when the spice toggle is on', () => {
    expect(ids(filterRecipes(recipes, filters({ isSpice: true })))).toEqual([1, 2, 3, 4])
  })

  it('keeps spice recipes hidden even when they match other filters', () => {
    expect(ids(filterRecipes(recipes, filters({ isVegetarian: true })))).toEqual([2])
  })
})

describe('hasActiveFilters', () => {
  it('is false for empty filters', () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false)
  })

  it('is false for a whitespace-only query', () => {
    expect(hasActiveFilters(filters({ query: '   ' }))).toBe(false)
  })

  it('is true when a query is present', () => {
    expect(hasActiveFilters(filters({ query: 'pasta' }))).toBe(true)
  })

  it('is true when a cuisine type is selected', () => {
    expect(hasActiveFilters(filters({ cuisineTypes: ['french'] }))).toBe(true)
  })

  it('is true when the vegetarian flag is active', () => {
    expect(hasActiveFilters(filters({ isVegetarian: true }))).toBe(true)
  })

  it('is true when the spice flag is active', () => {
    expect(hasActiveFilters(filters({ isSpice: true }))).toBe(true)
  })
})
