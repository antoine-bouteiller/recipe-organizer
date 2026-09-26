import { type MagimixProgram, type RotationSpeed } from '@recipe-organizer/shared/recipe/magimix'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

import { recipe } from './recipe'

const stepBase = () => ({
  id: integer('id').primaryKey(),
  // 1-based, contiguous per recipe across all step tables
  position: integer('position').notNull(),
  recipeId: integer('recipe_id')
    .notNull()
    .references(() => recipe.id, { onDelete: 'restrict' }),
})

export const textSteps = sqliteTable('text_steps', { ...stepBase(), text: text('text').notNull() }, (table) => [
  uniqueIndex('uq_text_steps_recipe_position').on(table.recipeId, table.position),
])

export const magimixSteps = sqliteTable(
  'magimix_steps',
  {
    ...stepBase(),
    program: text('program').$type<MagimixProgram>().notNull(),
    rotationSpeed: text('rotation_speed').$type<RotationSpeed>().notNull(),
    temperature: integer('temperature'),
    time: integer('time').notNull(),
  },
  (table) => [uniqueIndex('uq_magimix_steps_recipe_position').on(table.recipeId, table.position)]
)

export const subrecipeSteps = sqliteTable(
  'subrecipe_steps',
  {
    ...stepBase(),
    fromStep: integer('from_step'),
    subrecipeId: integer('subrecipe_id')
      .notNull()
      .references(() => recipe.id, { onDelete: 'restrict' }),
    toStep: integer('to_step'),
  },
  (table) => [
    uniqueIndex('uq_subrecipe_steps_recipe_position').on(table.recipeId, table.position),
    index('idx_subrecipe_steps_subrecipe_id').on(table.subrecipeId),
  ]
)
