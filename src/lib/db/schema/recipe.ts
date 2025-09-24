import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const recipe = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 255 }).notNull(),
  image: text('image', { length: 255 }).notNull(),
  steps: text('steps').notNull(),
  quantity: integer('quantity').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default([]),
})

export { recipe }
