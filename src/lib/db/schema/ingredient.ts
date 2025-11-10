import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const ingredient = sqliteTable('ingredients', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull().default('supermarket'),
  parentId: integer('parent_id'),
  factor: real('factor'),
})

const ingredientRelations = relations(ingredient, ({ one }) => ({
  parent: one(ingredient, {
    fields: [ingredient.parentId],
    references: [ingredient.id],
  }),
}))

export { ingredient, ingredientRelations }

