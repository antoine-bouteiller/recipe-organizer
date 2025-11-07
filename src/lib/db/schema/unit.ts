import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const unit = sqliteTable('units', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 100 }).notNull().unique(),
  symbol: text('symbol', { length: 50 }).notNull(),
  parentId: integer('parent_id'),
  factor: real('factor'),
})

export const unitRelations = relations(unit, ({ one }) => ({
  parent: one(unit, {
    fields: [unit.parentId],
    references: [unit.id],
  }),
}))

