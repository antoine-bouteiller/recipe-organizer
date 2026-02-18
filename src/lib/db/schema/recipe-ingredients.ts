import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { ingredient } from '@/lib/db/schema/ingredient'
import { recipe } from '@/lib/db/schema/recipe'
import { unit } from '@/lib/db/schema/unit'

export const recipeIngredientGroup = sqliteTable(
  'recipe_ingredient_groups',
  {
    groupName: text('group_name', { length: 255 }),
    id: integer('id').primaryKey(),
    isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
    recipeId: integer('recipe_id')
      .references(() => recipe.id, { onDelete: 'restrict' })
      .notNull(),
  },
  (table) => [
    index('idx_recipe_ingredient_groups_recipe_id').on(table.recipeId),
    index('idx_recipe_ingredient_groups_is_default').on(table.isDefault),
  ]
)

export const groupIngredient = sqliteTable(
  'group_ingredients',
  {
    groupId: integer('group_id')
      .references(() => recipeIngredientGroup.id, { onDelete: 'restrict' })
      .notNull(),
    id: integer('id').primaryKey(),
    ingredientId: integer('ingredient_id')
      .references(() => ingredient.id, { onDelete: 'restrict' })
      .notNull(),
    quantity: real('quantity').notNull(),
    unitId: integer('unit_id').references(() => unit.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [index('idx_group_ingredients_group_id').on(table.groupId), index('idx_group_ingredients_ingredient_id').on(table.ingredientId)]
)
