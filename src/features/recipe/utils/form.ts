import { createFieldMap } from '@tanstack/solid-form'

import { type RecipeFormInput } from '../api/create'

export const recipeDefaultValues: Partial<RecipeFormInput> = {
  cuisineTypes: [],
  image: undefined,
  ingredientGroups: [
    {
      _key: Math.random().toString(36).substring(7),
      ingredients: [
        {
          _key: Math.random().toString(36).substring(7),
          id: -1,
          quantity: 0,
        },
      ],
    },
  ],
  instructions: undefined,
  linkedRecipes: [],
  meals: [],
  name: '',
  servings: 4,
  video: undefined,
}

export const recipeFormFields = createFieldMap(recipeDefaultValues)
