import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { ingredient } from '@/lib/db/schema/ingredient'
import { recipe } from '@/lib/db/schema/recipe'
import { unit } from '@/lib/db/schema/unit'

const recipeIngredientsSection = sqliteTable('recipe_ingredients_sections', {
  id: integer('id').primaryKey(),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  name: text('name', { length: 255 }),
  ratio: real('ratio'),
  recipeId: integer('recipe_id')
    .references(() => recipe.id, { onDelete: 'cascade' })
    .notNull(),
  subRecipeId: integer('sub_recipe_id').references(() => recipe.id, {
    onDelete: 'cascade',
  }),
})

const sectionIngredient = sqliteTable('section_ingredients', {
  id: integer('id').primaryKey(),
  ingredientId: integer('ingredient_id')
    .references(() => ingredient.id, { onDelete: 'cascade' })
    .notNull(),
  quantity: real('quantity').notNull(),
  sectionId: integer('section_id')
    .references(() => recipeIngredientsSection.id, { onDelete: 'cascade' })
    .notNull(),
  unitId: integer('unit_id').references(() => unit.id, {
    onDelete: 'set null',
  }),
})

const ingredientsRelation = relations(ingredient, ({ many }) => ({
  sectionIngredients: many(sectionIngredient),
}))

const recipesRelation = relations(recipe, ({ many }) => ({
  sections: many(recipeIngredientsSection, { relationName: 'section' }),
  subRecipes: many(recipeIngredientsSection, { relationName: 'subRecipe' }),
}))

const recipeIngredientSectionRelation = relations(recipeIngredientsSection, ({ many, one }) => ({
  recipe: one(recipe, {
    fields: [recipeIngredientsSection.recipeId],
    references: [recipe.id],
    relationName: 'section',
  }),
  sectionIngredients: many(sectionIngredient),
  subRecipe: one(recipe, {
    fields: [recipeIngredientsSection.subRecipeId],
    references: [recipe.id],
    relationName: 'subRecipe',
  }),
}))

const sectionIngredientsRelation = relations(sectionIngredient, ({ one }) => ({
  ingredient: one(ingredient, {
    fields: [sectionIngredient.ingredientId],
    references: [ingredient.id],
  }),
  section: one(recipeIngredientsSection, {
    fields: [sectionIngredient.sectionId],
    references: [recipeIngredientsSection.id],
  }),
  unit: one(unit, {
    fields: [sectionIngredient.unitId],
    references: [unit.id],
  }),
}))

export {
  ingredientsRelation,
  recipeIngredientSectionRelation,
  recipeIngredientsSection,
  recipesRelation,
  sectionIngredient,
  sectionIngredientsRelation,
}
