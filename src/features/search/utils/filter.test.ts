import { describe, expect, it } from 'vite-plus/test'

import { type ReducedRecipe } from '@/features/recipe/api/get-all'

import { filterRecipes, hasActiveFilters } from './filter'

const recipes: ReducedRecipe[] = [
  { id: 1, image: '', name: 'Crème brûlée', servings: 4, tags: ['dessert', 'french'] },
  { id: 2, image: '', name: 'Pesto pasta', servings: 2, tags: ['italian', 'vegetarian'] },
  { id: 3, image: '', name: 'Steak frites', servings: 2, tags: ['french'] },
]

const ids = (result: ReducedRecipe[]) => result.map((recipe) => recipe.id)

describe('filterRecipes', () => {
  it('matches names accent- and case-insensitively', () => {
    expect(ids(filterRecipes(recipes, { query: 'CREME', tags: [] }))).toEqual([1])
  })

  it('returns every recipe for an empty query', () => {
    expect(ids(filterRecipes(recipes, { query: '', tags: [] }))).toEqual([1, 2, 3])
  })

  it('ignores a whitespace-only query', () => {
    expect(ids(filterRecipes(recipes, { query: '   ', tags: [] }))).toEqual([1, 2, 3])
  })

  it('filters by a single tag', () => {
    expect(ids(filterRecipes(recipes, { query: '', tags: ['vegetarian'] }))).toEqual([2])
  })

  it('AND-combines multiple tags', () => {
    expect(ids(filterRecipes(recipes, { query: '', tags: ['italian', 'vegetarian'] }))).toEqual([2])
  })

  it('returns no match when tags cannot co-occur', () => {
    expect(filterRecipes(recipes, { query: '', tags: ['italian', 'dessert'] })).toEqual([])
  })

  it('combines query and tag predicates', () => {
    expect(ids(filterRecipes(recipes, { query: 'steak', tags: ['french'] }))).toEqual([3])
  })
})

describe('hasActiveFilters', () => {
  it('is false for empty filters', () => {
    expect(hasActiveFilters({ query: '', tags: [] })).toBe(false)
  })

  it('is false for a whitespace-only query', () => {
    expect(hasActiveFilters({ query: '   ', tags: [] })).toBe(false)
  })

  it('is true when a query is present', () => {
    expect(hasActiveFilters({ query: 'pasta', tags: [] })).toBe(true)
  })

  it('is true when a tag is selected', () => {
    expect(hasActiveFilters({ query: '', tags: ['french'] })).toBe(true)
  })
})
