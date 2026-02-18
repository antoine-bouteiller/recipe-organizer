import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const ingredientCategory = ['meat', 'fish', 'vegetables', 'spices', 'other'] as const

export const ingredient = sqliteTable(
  'ingredients',
  {
    category: text('category', {
      enum: ingredientCategory,
    })
      .notNull()
      .default('other'),
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    parentId: integer('parent_id'),
  },
  (table) => [index('idx_ingredients_category').on(table.category)]
)
