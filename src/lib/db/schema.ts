import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const ingredients = sqliteTable('ingredients', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  pluralName: text('plural_name'),
})

const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 255 }).notNull(),
  image: text('image', { length: 255 }).notNull(),
  steps: text('steps').notNull(),
})

const recipeSections = sqliteTable('recipe_sections', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 255 }),
  recipeId: integer('recipe_id')
    .references(() => recipes.id, { onDelete: 'cascade' })
    .notNull(),
  subRecipeId: integer('sub_recipe_id').references(() => recipes.id, {
    onDelete: 'cascade',
  }),
  ratio: real('ratio'),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
})

const sectionIngredients = sqliteTable('section_ingredients', {
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

const ingredientsRelations = relations(ingredients, ({ many }) => ({
  sectionIngredients: many(sectionIngredients),
}))

const recipesRelations = relations(recipes, ({ many }) => ({
  sections: many(recipeSections, { relationName: 'section' }),
  subRecipes: many(recipeSections, { relationName: 'subRecipe' }),
}))

const recipeSectionsRelations = relations(recipeSections, ({ one, many }) => ({
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

const sectionIngredientsRelations = relations(sectionIngredients, ({ one }) => ({
  section: one(recipeSections, {
    fields: [sectionIngredients.sectionId],
    references: [recipeSections.id],
  }),
  ingredient: one(ingredients, {
    fields: [sectionIngredients.ingredientId],
    references: [ingredients.id],
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

const schema = {
  ingredients,
  recipes,
  recipeSections,
  sectionIngredients,
  user,
  session,
  account,
  verification,
  ingredientsRelations,
  recipesRelations,
  recipeSectionsRelations,
  sectionIngredientsRelations,
}

export default schema

export {
  ingredients,
  recipes,
  recipeSections,
  sectionIngredients,
  user,
  session,
  account,
  verification,
  ingredientsRelations,
  recipesRelations,
  recipeSectionsRelations,
  sectionIngredientsRelations,
}
