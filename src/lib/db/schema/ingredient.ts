import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { type UnitSlug } from '@/lib/db/schema/unit'

export const ingredientCategory = ['meat', 'fish', 'vegetables', 'spices', 'other'] as const

export const ingredient = sqliteTable(
  'ingredients',
  {
    category: text('category', {
      enum: ingredientCategory,
    })
      .notNull()
      .default('other'),
    countWeightG: real('count_weight_g'),
    densityGPerMl: real('density_g_per_ml'),
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    parentId: integer('parent_id'),
    preferredUnitSlug: text('preferred_unit_slug').$type<UnitSlug>(),
  },
  (table) => [index('idx_ingredients_category').on(table.category)]
)
