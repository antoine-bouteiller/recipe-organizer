import { index, integer, real, sqliteTable } from 'drizzle-orm/sqlite-core'

import { recipe } from '@/lib/db/schema/recipe'

const recipeLinkedRecipes = sqliteTable(
  'recipe_linked_recipes',
  {
    linkedRecipeId: integer('linked_recipe_id')
      .references(() => recipe.id, { onDelete: 'restrict' })
      .notNull(),
    ratio: real('ratio').notNull().default(1),
    recipeId: integer('recipe_id')
      .references(() => recipe.id, { onDelete: 'restrict' })
      .notNull(),
  },
  (table) => [
    index('idx_recipe_linked_recipes_recipe_id').on(table.recipeId),
    index('idx_recipe_linked_recipes_linked_recipe_id').on(table.linkedRecipeId),
  ]
)

export { recipeLinkedRecipes }
