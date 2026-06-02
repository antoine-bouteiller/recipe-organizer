import { type db } from 'void/db'

export const ingredientGroupSelect = {
  columns: {
    groupName: true,
    id: true,
  },
  orderBy: (fields, { desc }) => desc(fields.isDefault),
  with: {
    groupIngredients: {
      columns: {
        id: true,
        quantity: true,
        unitSlug: true,
      },
      // Drizzle V1 rewrites table aliases on `${column}` interpolations inside `with`, so we use
      // Literal identifiers for the subquery to keep the inner refs pointing at the real ingredients table.
      where: (fields, { notInArray, sql }) => notInArray(fields.ingredientId, sql`(SELECT "id" FROM "ingredients" WHERE "category" = 'spices')`),
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
} satisfies Parameters<typeof db.query.recipeIngredientGroup.findMany>[0]
