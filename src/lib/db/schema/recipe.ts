import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { type CuisineType, type Meal } from '@/features/recipe/utils/constants'

export const recipe = sqliteTable('recipes', {
  createdBy: text('created_by').notNull().default('1'),
  cuisineTypes: text('cuisine_types', { mode: 'json' }).$type<CuisineType[]>().notNull().default([]),
  id: integer('id').primaryKey(),
  image: text('image', { length: 255 }).notNull(),
  instructions: text('instructions').notNull(),
  isMagimix: integer('is_magimix', { mode: 'boolean' }).notNull().default(false),
  isSpice: integer('is_spice', { mode: 'boolean' }).notNull().default(false),
  isVegetarian: integer('is_vegetarian', { mode: 'boolean' }).notNull().default(false),
  meals: text('meals', { mode: 'json' }).$type<Meal[]>().notNull().default([]),
  name: text('name', { length: 255 }).notNull(),
  servings: integer('servings').notNull(),
  video: text('video', { length: 255 }),
})
