import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const ingredients = sqliteTable('ingredients', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  pluralName: text('plural_name'),
})

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 255 }).notNull(),
  image: text('image', { length: 255 }).notNull(),
  steps: text('steps').notNull(),
})

export const recipeSections = sqliteTable('recipe_sections', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 255 }),
  recipeId: integer('recipe_id')
    .references(() => recipes.id, { onDelete: 'cascade' })
    .notNull(),
  subRecipeId: integer('sub_recipe_id').references(() => recipes.id, {
    onDelete: 'cascade',
  }),
})

export const sectionIngredients = sqliteTable('section_ingredients', {
  id: integer('id').primaryKey(),
  sectionId: integer('section_id')
    .references(() => recipeSections.id, { onDelete: 'cascade' })
    .notNull(),
  ingredientId: integer('ingredient_id')
    .references(() => ingredients.id, { onDelete: 'cascade' })
    .notNull(),
  quantity: real('quantity').notNull(),
  unit: text('unit'),
})

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  sectionIngredients: many(sectionIngredients),
}))

export const recipesRelations = relations(recipes, ({ many }) => ({
  sections: many(recipeSections, { relationName: 'section' }),
  subRecipes: many(recipeSections, { relationName: 'subRecipe' }),
}))

export const recipeSectionsRelations = relations(recipeSections, ({ one, many }) => ({
  recipe: one(recipes, {
    fields: [recipeSections.recipeId],
    references: [recipes.id],
    relationName: 'section',
  }),
  subRecipe: one(recipes, {
    fields: [recipeSections.subRecipeId],
    references: [recipes.id],
    relationName: 'subRecipe',
  }),
  sectionIngredients: many(sectionIngredients),
}))

export const sectionIngredientsRelations = relations(sectionIngredients, ({ one }) => ({
  section: one(recipeSections, {
    fields: [sectionIngredients.sectionId],
    references: [recipeSections.id],
  }),
  ingredient: one(ingredients, {
    fields: [sectionIngredients.ingredientId],
    references: [ingredients.id],
  }),
}))
