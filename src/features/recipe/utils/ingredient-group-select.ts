import { type getDb } from '@/lib/db'

export const ingredientGroupSelect = {
  columns: {
    groupName: true,
    id: true,
  },
  with: {
    groupIngredients: {
      columns: {
        id: true,
        quantity: true,
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
