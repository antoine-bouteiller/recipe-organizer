import { createFieldMap } from '@tanstack/react-form'

import type { RecipeFormInput } from '../api/create'

export const recipeDefaultValues: RecipeFormInput = {
  image: undefined,
  name: '',
  quantity: 4,
  sections: [
    {
      ingredients: [
        {
          id: '',
          quantity: 0,
        },
      ],
    },
  ],
  steps: '',
}

export const recipeFormFields = createFieldMap(recipeDefaultValues)
