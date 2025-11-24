import { createFieldMap } from '@tanstack/react-form'
import type { RecipeFormInput } from '../api/create'

export const recipeDefaultValues: RecipeFormInput = {
  name: '',
  steps: '',
  image: undefined,
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
}

export const recipeFormFields = createFieldMap(recipeDefaultValues)
