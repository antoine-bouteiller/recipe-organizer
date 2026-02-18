import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const recipe = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  image: text('image', { length: 255 }).notNull(),
  instructions: text('instructions').notNull(),
  name: text('name', { length: 255 }).notNull(),
  servings: integer('servings').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull().default([]),
  video: text('video', { length: 255 }),
})
