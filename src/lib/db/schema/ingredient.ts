import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { unit } from './unit'

const ingredient = sqliteTable('ingredients', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull().default('supermarket'),
  parentId: integer('parent_id'),
})

const ingredientUnit = sqliteTable('ingredient_units', {
  id: integer('id').primaryKey(),
  ingredientId: integer('ingredient_id')
    .references(() => ingredient.id, { onDelete: 'cascade' })
    .notNull(),
  unitId: integer('unit_id')
    .references(() => unit.id, { onDelete: 'cascade' })
    .notNull(),
})

const ingredientRelations = relations(ingredient, ({ one, many }) => ({
  parent: one(ingredient, {
    fields: [ingredient.parentId],
    references: [ingredient.id],
  }),
  ingredientUnits: many(ingredientUnit),
}))

const ingredientUnitRelations = relations(ingredientUnit, ({ one }) => ({
  ingredient: one(ingredient, {
    fields: [ingredientUnit.ingredientId],
    references: [ingredient.id],
  }),
  unit: one(unit, {
    fields: [ingredientUnit.unitId],
    references: [unit.id],
  }),
}))

export { ingredient, ingredientRelations, ingredientUnit, ingredientUnitRelations }
