import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const unit = sqliteTable('units', {
  factor: real('factor'),
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  parentId: integer('parent_id'),
})
