import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import type { RecipeTag } from '@/features/recipe/utils/constants'

export const recipe = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  image: text('image', { length: 255 }).notNull(),
  instructions: text('instructions').notNull(),
  name: text('name', { length: 255 }).notNull(),
  servings: integer('servings').notNull(),
  tags: text('tags', { mode: 'json' }).$type<RecipeTag[]>().notNull().default([]),
  createdBy: text('created_by').notNull().default('1'),
  video: text('video', { length: 255 }),
})
