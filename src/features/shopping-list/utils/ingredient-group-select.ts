import { type getDb } from '@/lib/db'

export const ingredientGroupSelect = {
  columns: {
    groupName: true,
    id: true,
  },
  orderBy: {
    isDefault: 'desc',
  },
  with: {
    groupIngredients: {
      columns: {
        id: true,
        quantity: true,
      },
      where: {
        ingredient: {
          category: {
            NOT: 'spices',
          },
        },
      },
      with: {
        ingredient: {
          columns: {
            category: true,
            id: true,
            name: true,
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
    },
  },
} satisfies Parameters<ReturnType<typeof getDb>['query']['recipeIngredientGroup']['findMany']>[0]
