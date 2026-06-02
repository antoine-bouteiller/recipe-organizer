import { type db } from 'void/db'

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
        unitSlug: true,
      },
      with: {
        ingredient: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
} satisfies Parameters<typeof db.query.recipeIngredientGroup.findMany>[0]
