import { type ReducedRecipe } from '@/features/recipe/api/get-all'
import { type RecipeTag } from '@/features/recipe/utils/constants'

import { normalize } from './normalize'

export interface SearchFilters {
  query: string
  tags: RecipeTag[]
}

export const EMPTY_FILTERS: SearchFilters = { query: '', tags: [] }

export const hasActiveFilters = (filters: SearchFilters): boolean => filters.query.trim() !== '' || filters.tags.length > 0

const matchesQuery = (recipe: ReducedRecipe, query: string): boolean => {
  const normalizedQuery = normalize(query.trim())
  if (normalizedQuery === '') {
    return true
  }
  return normalize(recipe.name).includes(normalizedQuery)
}

const matchesTags = (recipe: ReducedRecipe, tags: RecipeTag[]): boolean => tags.every((tag) => recipe.tags.includes(tag))

export const filterRecipes = (recipes: ReducedRecipe[], filters: SearchFilters): ReducedRecipe[] =>
  recipes.filter((recipe) => matchesQuery(recipe, filters.query) && matchesTags(recipe, filters.tags))
