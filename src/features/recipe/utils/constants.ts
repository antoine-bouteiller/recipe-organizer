import { createFieldMap } from '@tanstack/react-form'

import type { RecipeFormInput } from '../api/create'

export const recipeDefaultValues: RecipeFormInput = {
  image: undefined,
  ingredientGroups: [
    {
      ingredients: [
        {
          id: '',
          quantity: 0,
        },
      ],
    },
  ],
  instructions: '',
  isSubrecipe: false,
  name: '',
  servings: 4,
}

export const recipeFormFields = createFieldMap(recipeDefaultValues)
