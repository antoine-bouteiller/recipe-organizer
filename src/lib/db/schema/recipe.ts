import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const recipe = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  image: text('image', { length: 255 }).notNull(),
  name: text('name', { length: 255 }).notNull(),
  quantity: integer('quantity').notNull(),
  steps: text('steps').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default([]),
})

export { recipe }
