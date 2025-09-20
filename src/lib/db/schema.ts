import type { Unit } from '@/types/units'
import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const ingredient = sqliteTable('ingredients', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  allowedUnits: text('allowed_units', { mode: 'json' }).$type<Unit[]>().default([]),
  category: text('category').notNull().default('supermarket'),
  vegan: integer('vegan', { mode: 'boolean' }).notNull().default(false),
  parentId: integer('parent_id'),
})

const recipe = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 255 }).notNull(),
  image: text('image', { length: 255 }).notNull(),
  steps: text('steps').notNull(),
  quantity: integer('quantity').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default([]),
})

const recipeIngredientsSection = sqliteTable('recipe_ingredients_sections', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 255 }),
  recipeId: integer('recipe_id')
    .references(() => recipe.id, { onDelete: 'cascade' })
    .notNull(),
  subRecipeId: integer('sub_recipe_id').references(() => recipe.id, {
    onDelete: 'cascade',
  }),
  ratio: real('ratio'),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
})

const sectionIngredient = sqliteTable('section_ingredients', {
  id: integer('id').primaryKey(),
  sectionId: integer('section_id')
    .references(() => recipeIngredientsSection.id, { onDelete: 'cascade' })
    .notNull(),
  ingredientId: integer('ingredient_id')
    .references(() => ingredient.id, { onDelete: 'cascade' })
    .notNull(),
  quantity: real('quantity').notNull(),
  unit: text('unit'),
})

const ingredientsRelation = relations(ingredient, ({ many }) => ({
  sectionIngredients: many(sectionIngredient),
}))

const recipesRelation = relations(recipe, ({ many }) => ({
  sections: many(recipeIngredientsSection, { relationName: 'section' }),
  subRecipes: many(recipeIngredientsSection, { relationName: 'subRecipe' }),
}))

const subIngredientRelation = relations(ingredient, ({ one }) => ({
  parent: one(ingredient, {
    fields: [ingredient.parentId],
    references: [ingredient.id],
  }),
}))

const recipeIngredientSectionRelation = relations(recipeIngredientsSection, ({ one, many }) => ({
  recipe: one(recipe, {
    fields: [recipeIngredientsSection.recipeId],
    references: [recipe.id],
    relationName: 'section',
  }),
  subRecipe: one(recipe, {
    fields: [recipeIngredientsSection.subRecipeId],
    references: [recipe.id],
    relationName: 'subRecipe',
  }),
  sectionIngredients: many(sectionIngredient),
}))

const sectionIngredientsRelation = relations(sectionIngredient, ({ one }) => ({
  section: one(recipeIngredientsSection, {
    fields: [sectionIngredient.sectionId],
    references: [recipeIngredientsSection.id],
  }),
  ingredient: one(ingredient, {
    fields: [sectionIngredient.ingredientId],
    references: [ingredient.id],
  }),
}))

const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
})

const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
})

export const schema = {
  ingredient,
  recipe,
  recipeIngredientsSection,
  sectionIngredient,
  user,
  session,
  subIngredientRelation,
  account,
  verification,
  ingredientsRelation,
  recipesRelation,
  recipeIngredientsSectionsRelation: recipeIngredientSectionRelation,
  sectionIngredientsRelation,
}

export default schema

export {
  ingredient,
  recipe,
  recipeIngredientsSection,
  sectionIngredient,
  user,
  session,
  subIngredientRelation,
  account,
  verification,
  ingredientsRelation,
  recipesRelation,
  recipeIngredientSectionRelation as recipeIngredientsSectionsRelation,
  sectionIngredientsRelation,
}
