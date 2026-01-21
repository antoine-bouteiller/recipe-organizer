import { integer, real, sqliteTable } from 'drizzle-orm/sqlite-core'

import { recipe } from '@/lib/db/schema/recipe'

const recipeLinkedRecipes = sqliteTable('recipe_linked_recipes', {
  linkedRecipeId: integer('linked_recipe_id')
    .references(() => recipe.id, { onDelete: 'restrict' })
    .notNull(),
  ratio: real('ratio').notNull().default(1),
  recipeId: integer('recipe_id')
    .references(() => recipe.id, { onDelete: 'restrict' })
    .notNull(),
})

export { recipeLinkedRecipes }
