import { type MagimixProgram, type RotationSpeed } from '@recipe-organizer/shared/recipe/magimix'
import { sql } from 'drizzle-orm'
import { check, index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

import { recipe } from './recipe'

// A group either owns steps or, when `subrecipeId` is set, shows a linked recipe's default group.
export const recipeStepGroup = sqliteTable(
  'recipe_step_groups',
  {
    groupName: text('group_name', { length: 255 }),
    id: integer('id').primaryKey(),
    isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
    // 1-based, contiguous per recipe
    position: integer('position').notNull(),
    recipeId: integer('recipe_id')
      .references(() => recipe.id, { onDelete: 'restrict' })
      .notNull(),
    subrecipeId: integer('subrecipe_id').references(() => recipe.id, { onDelete: 'restrict' }),
  },
  (table) => [
    uniqueIndex('uq_recipe_step_groups_recipe_position').on(table.recipeId, table.position),
    index('idx_recipe_step_groups_subrecipe_id').on(table.subrecipeId),
    check('ck_recipe_step_groups_subrecipe', sql`${table.subrecipeId} IS NULL OR (${table.groupName} IS NULL AND ${table.isDefault} = 0)`),
  ]
)

export const recipeStep = sqliteTable(
  'recipe_steps',
  {
    groupId: integer('group_id')
      .references(() => recipeStepGroup.id, { onDelete: 'cascade' })
      .notNull(),
    id: integer('id').primaryKey(),
    // 1-based, contiguous per group
    position: integer('position').notNull(),
  },
  (table) => [uniqueIndex('uq_recipe_steps_group_position').on(table.groupId, table.position)]
)

const stepId = () =>
  integer('step_id')
    .primaryKey()
    .references(() => recipeStep.id, { onDelete: 'cascade' })

export const textSteps = sqliteTable('text_steps', { stepId: stepId(), text: text('text').notNull() })

export const magimixSteps = sqliteTable('magimix_steps', {
  program: text('program').$type<MagimixProgram>().notNull(),
  rotationSpeed: text('rotation_speed').$type<RotationSpeed>().notNull(),
  stepId: stepId(),
  temperature: integer('temperature'),
  time: integer('time').notNull(),
})
