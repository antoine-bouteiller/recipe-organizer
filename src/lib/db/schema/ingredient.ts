import type { Unit } from '@/types/units'
import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const ingredient = sqliteTable('ingredients', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  allowedUnits: text('allowed_units', { mode: 'json' }).$type<Unit[]>().default([]),
  category: text('category').notNull().default('supermarket'),
  parentId: integer('parent_id'),
})

const subIngredientRelation = relations(ingredient, ({ one }) => ({
  parent: one(ingredient, {
    fields: [ingredient.parentId],
    references: [ingredient.id],
  }),
}))

export { ingredient, subIngredientRelation }
