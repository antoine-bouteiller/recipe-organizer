import { createFieldMap } from '@tanstack/react-form'

import type { getDb } from '@/lib/db'

import type { RecipeFormInput } from '../api/create'

export const RECIPE_TAGS = ['dessert', 'mediterranean', 'chinese', 'japanese', 'indian', 'mexican', 'italian', 'french'] as const

export type RecipeTag = (typeof RECIPE_TAGS)[number] | (typeof AUTO_TAGS)[number]

export const RECIPE_TAG_LABELS: Record<RecipeTag, string> = {
  chinese: 'Chinois',
  dessert: 'Dessert',
  french: 'Français',
  indian: 'Indien',
  italian: 'Italien',
  japanese: 'Japonais',
  magimix: 'Magimix',
  mediterranean: 'Méditerranéen',
  mexican: 'Mexicain',
  vegetarian: 'Végétarien',
}

export const AUTO_TAGS = ['vegetarian', 'magimix'] as const

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
  tags: [],
  video: undefined,
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
