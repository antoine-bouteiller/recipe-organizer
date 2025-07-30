import { pgTable, serial, varchar, timestamp, integer, real, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const units = pgEnum('unit', ['kg', 'l', 'CàC', 'CàS'])

export const ingredients = pgTable('ingredients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  pluralName: varchar('plural_name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  image: varchar('image', { length: 255 }).notNull(),
  steps: varchar('steps').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const recipeSections = pgTable('recipe_sections', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  recipeId: integer('recipe_id')
    .references(() => recipes.id, { onDelete: 'cascade' })
    .notNull(),
  subRecipeId: integer('sub_recipe_id').references(() => recipes.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const sectionIngredients = pgTable('section_ingredients', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id')
    .references(() => recipeSections.id, { onDelete: 'cascade' })
    .notNull(),
  ingredientId: integer('ingredient_id')
    .references(() => ingredients.id, { onDelete: 'cascade' })
    .notNull(),
  quantity: real('quantity').notNull(),
  unit: units('unit'),
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
