import { createFieldMap } from '@tanstack/react-form'

import type { RecipeFormInput } from '../api/create'

export const recipeDefaultValues: Partial<RecipeFormInput> = {
  image: undefined,
  ingredientGroups: [
    {
      _key: crypto.randomUUID(),
      ingredients: [
        {
          id: -1,
          quantity: 0,
        },
      ],
    },
  ],
  instructions: '',
  linkedRecipes: [],
  name: '',
  servings: 4,
  tags: [],
  video: undefined,
}

export const recipeFormFields = createFieldMap(recipeDefaultValues)
