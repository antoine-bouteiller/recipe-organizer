import type { getDb } from '@/lib/db'

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
