import type { getDb } from '@/lib/db'

export const ingredientGroupSelect = {
  orderBy: {
    isDefault: 'desc',
  },
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
            category: true,
            parentId: true,
          },
        },
        unit: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        ingredient: {
          category: {
            NOT: 'spices',
          },
        },
      },
    },
  },
} satisfies Parameters<ReturnType<typeof getDb>['query']['recipeIngredientGroup']['findMany']>[0]
