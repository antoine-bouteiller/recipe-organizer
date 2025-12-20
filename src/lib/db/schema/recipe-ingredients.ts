import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { ingredient } from '@/lib/db/schema/ingredient'
import { recipe } from '@/lib/db/schema/recipe'
import { recipeLinkedRecipes } from '@/lib/db/schema/recipe-linked-recipes'
import { unit } from '@/lib/db/schema/unit'

const recipeIngredientGroup = sqliteTable('recipe_ingredient_groups', {
  groupName: text('group_name', { length: 255 }),
  id: integer('id').primaryKey(),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  recipeId: integer('recipe_id')
    .references(() => recipe.id, { onDelete: 'restrict' })
    .notNull(),
})

const groupIngredient = sqliteTable('group_ingredients', {
  groupId: integer('group_id')
    .references(() => recipeIngredientGroup.id, { onDelete: 'restrict' })
    .notNull(),
  id: integer('id').primaryKey(),
  ingredientId: integer('ingredient_id')
    .references(() => ingredient.id, { onDelete: 'restrict' })
    .notNull(),
  quantity: real('quantity').notNull(),
  unitId: integer('unit_id').references(() => unit.id, {
    onDelete: 'set null',
  }),
})

const ingredientsRelation = relations(ingredient, ({ many }) => ({
  groupIngredients: many(groupIngredient),
}))

const recipesRelation = relations(recipe, ({ many }) => ({
  ingredientGroups: many(recipeIngredientGroup),
  linkedRecipes: many(recipeLinkedRecipes, { relationName: 'linkedRecipes' }),
}))

const recipeIngredientGroupRelation = relations(recipeIngredientGroup, ({ many, one }) => ({
  groupIngredients: many(groupIngredient),
  recipe: one(recipe, {
    fields: [recipeIngredientGroup.recipeId],
    references: [recipe.id],
  }),
}))

const groupIngredientsRelation = relations(groupIngredient, ({ one }) => ({
  group: one(recipeIngredientGroup, {
    fields: [groupIngredient.groupId],
    references: [recipeIngredientGroup.id],
  }),
  ingredient: one(ingredient, {
    fields: [groupIngredient.ingredientId],
    references: [ingredient.id],
  }),
  unit: one(unit, {
    fields: [groupIngredient.unitId],
    references: [unit.id],
  }),
}))

export { groupIngredient, groupIngredientsRelation, ingredientsRelation, recipeIngredientGroup, recipeIngredientGroupRelation, recipesRelation }
