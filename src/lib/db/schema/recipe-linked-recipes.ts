import { relations } from 'drizzle-orm'
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core'

import { recipe } from '@/lib/db/schema/recipe'

const recipeLinkedRecipes = sqliteTable('recipe_linked_recipes', {
  id: integer('id').primaryKey(),
  linkedRecipeId: integer('linked_recipe_id')
    .references(() => recipe.id, { onDelete: 'restrict' })
    .notNull(),
  position: integer('position').notNull(),
  recipeId: integer('recipe_id')
    .references(() => recipe.id, { onDelete: 'restrict' })
    .notNull(),
})

const recipeLinkedRecipesRelation = relations(recipeLinkedRecipes, ({ one }) => ({
  linkedRecipe: one(recipe, {
    fields: [recipeLinkedRecipes.linkedRecipeId],
    references: [recipe.id],
    relationName: 'linkedTo',
  }),
  recipe: one(recipe, {
    fields: [recipeLinkedRecipes.recipeId],
    references: [recipe.id],
    relationName: 'linkedRecipes',
  }),
}))

export { recipeLinkedRecipes, recipeLinkedRecipesRelation }
