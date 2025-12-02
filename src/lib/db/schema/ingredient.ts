import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const ingredientCategory = ['meat', 'fish', 'vegetables', 'spices', 'other'] as const

const ingredient = sqliteTable('ingredients', {
  category: text('category', {
    enum: ingredientCategory,
  })
    .notNull()
    .default('other'),
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  parentId: integer('parent_id'),
})

const ingredientRelations = relations(ingredient, ({ one }) => ({
  parent: one(ingredient, {
    fields: [ingredient.parentId],
    references: [ingredient.id],
  }),
}))

export { ingredient, ingredientRelations }
