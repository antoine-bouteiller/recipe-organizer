import { type CuisineType, type Meal, type ReducedRecipe } from '@/types/recipe'

import { normalize } from './normalize'

export interface SearchFilters {
  query: string
  cuisineTypes: CuisineType[]
  meals: Meal[]
  isVegetarian: boolean
  isMagimix: boolean
  isSpice: boolean
}

export const EMPTY_FILTERS: SearchFilters = { cuisineTypes: [], isMagimix: false, isSpice: false, isVegetarian: false, meals: [], query: '' }

export const hasActiveFilters = (filters: SearchFilters): boolean =>
  filters.query.trim() !== '' ||
  filters.cuisineTypes.length > 0 ||
  filters.meals.length > 0 ||
  filters.isVegetarian ||
  filters.isMagimix ||
  filters.isSpice

const matchesQuery = (recipe: ReducedRecipe, query: string): boolean => {
  const normalizedQuery = normalize(query.trim())
  if (normalizedQuery === '') {
    return true
  }
  return normalize(recipe.name).includes(normalizedQuery)
}

const matchesFilters = (recipe: ReducedRecipe, filters: SearchFilters): boolean =>
  filters.cuisineTypes.every((cuisineType) => recipe.cuisineTypes.includes(cuisineType)) &&
  filters.meals.every((meal) => recipe.meals.includes(meal)) &&
  (!filters.isVegetarian || recipe.isVegetarian) &&
  (!filters.isMagimix || recipe.isMagimix) &&
  // Spice recipes are hidden unless the Épices toggle is on.
  (filters.isSpice || !recipe.isSpice)

export const filterRecipes = (recipes: ReducedRecipe[], filters: SearchFilters): ReducedRecipe[] =>
  recipes.filter((recipe) => matchesQuery(recipe, filters.query) && matchesFilters(recipe, filters))
