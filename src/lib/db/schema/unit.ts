import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const unit = sqliteTable('units', {
  factor: real('factor'),
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  parentId: integer('parent_id'),
})

export const unitRelations = relations(unit, ({ one }) => ({
  parent: one(unit, {
    fields: [unit.parentId],
    references: [unit.id],
  }),
}))
