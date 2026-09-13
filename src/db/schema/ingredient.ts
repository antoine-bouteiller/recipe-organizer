import { ingredientCategory } from '@shared/ingredients/categories'
import { type UnitSlug } from '@shared/units'
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

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
