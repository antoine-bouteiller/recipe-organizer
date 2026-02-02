import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const recipe = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  image: text('image', { length: 255 }).notNull(),
  instructions: text('instructions').notNull(),
  isVegetarian: integer('is_vegetarian', { mode: 'boolean' }).notNull().default(true),
  isMagimix: integer('is_magimix', { mode: 'boolean' }).notNull().default(false),
  name: text('name', { length: 255 }).notNull(),
  servings: integer('servings').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default([]),
  videoLink: text('video_link', { length: 500 }),
})

export { recipe }
