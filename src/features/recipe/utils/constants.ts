import { createFieldMap } from '@tanstack/react-form'

import type { getDb } from '@/lib/db'

import type { RecipeFormInput } from '../api/create'

export const recipeDefaultValues: Partial<RecipeFormInput> = {
  image: undefined,
  ingredientGroups: [
    {
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
  videoLink: undefined,
}

export const recipeFormFields = createFieldMap(recipeDefaultValues)

export const ingredientGroupSelect = {
  columns: {
    id: true,
    groupName: true,
  },
  with: {
    groupIngredients: {
      columns: {
        quantity: true,
        id: true,
      },
      with: {
        ingredient: {
          columns: {
            id: true,
            name: true,
          },
        },
        unit: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
} satisfies Parameters<ReturnType<typeof getDb>['query']['recipeIngredientGroup']['findMany']>[0]
