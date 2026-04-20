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
        unitSlug: true,
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
            countWeightG: true,
            densityGPerMl: true,
            id: true,
            name: true,
            parentId: true,
            preferredUnitSlug: true,
          },
        },
      },
    },
  },
} satisfies Parameters<ReturnType<typeof getDb>['query']['recipeIngredientGroup']['findMany']>[0]
