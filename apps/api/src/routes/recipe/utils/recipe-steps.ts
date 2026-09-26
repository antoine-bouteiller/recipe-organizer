// oxlint-disable-next-line import/consistent-type-specifier-style -- an inline type import keeps a runtime import of `cloudflare:workers`, which unit tests cannot load.
import type { getDb } from '@recipe-organizer/api/lib/db'
import { magimixSteps, subrecipeSteps, textSteps } from '@recipe-organizer/api/schema'
import { type RecipeStep } from '@recipe-organizer/shared/recipe/schemas'
import { asc, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

type Db = ReturnType<typeof getDb>
type TextStepRow = Pick<typeof textSteps.$inferSelect, 'position' | 'text'>
type MagimixStepRow = Pick<typeof magimixSteps.$inferSelect, 'position' | 'program' | 'rotationSpeed' | 'temperature' | 'time'>
type SubrecipeStepRow = Pick<typeof subrecipeSteps.$inferSelect, 'fromStep' | 'position' | 'subrecipeId' | 'toStep'>

interface StepRows {
  readonly magimix: readonly MagimixStepRow[]
  readonly subrecipe: readonly SubrecipeStepRow[]
  readonly text: readonly TextStepRow[]
}

const optional = (value: number | null) => value ?? undefined

// Each step keeps its 1-based array index as `position`, so positions stay contiguous across tables.
export const stepsToRows = (steps: readonly RecipeStep[]): StepRows => {
  const positioned = steps.map((step, index) => ({ position: index + 1, step }))
  return {
    magimix: positioned.flatMap(({ position, step }) =>
      step.kind === 'magimix'
        ? [{ position, program: step.program, rotationSpeed: step.rotationSpeed, temperature: step.temperature ?? null, time: step.time }]
        : []
    ),
    subrecipe: positioned.flatMap(({ position, step }) =>
      step.kind === 'subrecipe' ? [{ fromStep: step.fromStep ?? null, position, subrecipeId: step.recipeId, toStep: step.toStep ?? null }] : []
    ),
    text: positioned.flatMap(({ position, step }) => (step.kind === 'text' ? [{ position, text: step.text }] : [])),
  }
}

export const rowsToSteps = ({ magimix, subrecipe, text }: StepRows): RecipeStep[] =>
  [
    ...text.map((row) => ({ position: row.position, step: { kind: 'text', text: row.text } satisfies RecipeStep })),
    ...magimix.map((row) => ({
      position: row.position,
      step: {
        kind: 'magimix',
        program: row.program,
        rotationSpeed: row.rotationSpeed,
        temperature: optional(row.temperature),
        time: row.time,
      } satisfies RecipeStep,
    })),
    ...subrecipe.map((row) => ({
      position: row.position,
      step: { fromStep: optional(row.fromStep), kind: 'subrecipe', recipeId: row.subrecipeId, toStep: optional(row.toStep) } satisfies RecipeStep,
    })),
  ]
    .toSorted((left, right) => left.position - right.position)
    .map(({ step }) => step)

// A sub-recipe step is a view onto a declared link, never onto the recipe itself.
export const assertSubrecipeSteps = (steps: readonly RecipeStep[], linkedRecipeIds: readonly number[], recipeId?: number): void => {
  const invalid = steps.some((step) => step.kind === 'subrecipe' && (step.recipeId === recipeId || !linkedRecipeIds.includes(step.recipeId)))
  if (invalid) {
    throw new HTTPException(400, { message: 'Sub-recipe step must reference a linked recipe' })
  }
}

export const selectRecipeSteps = async (db: Db, recipeId: number): Promise<RecipeStep[]> => {
  const [text, magimix, subrecipe] = await db.batch([
    db.select().from(textSteps).where(eq(textSteps.recipeId, recipeId)).orderBy(asc(textSteps.position)),
    db.select().from(magimixSteps).where(eq(magimixSteps.recipeId, recipeId)).orderBy(asc(magimixSteps.position)),
    db.select().from(subrecipeSteps).where(eq(subrecipeSteps.recipeId, recipeId)).orderBy(asc(subrecipeSteps.position)),
  ])
  return rowsToSteps({ magimix, subrecipe, text })
}

export const deleteRecipeSteps = (db: Db, recipeId: number) =>
  [
    db.delete(textSteps).where(eq(textSteps.recipeId, recipeId)),
    db.delete(magimixSteps).where(eq(magimixSteps.recipeId, recipeId)),
    db.delete(subrecipeSteps).where(eq(subrecipeSteps.recipeId, recipeId)),
  ] as const

// One statement per row keeps each query under D1's bound-parameter limit.
export const writeRecipeSteps = async (db: Db, recipeId: number, steps: readonly RecipeStep[]): Promise<void> => {
  const rows = stepsToRows(steps)
  const [first, ...rest] = [
    ...rows.text.map((row) => db.insert(textSteps).values({ ...row, recipeId })),
    ...rows.magimix.map((row) => db.insert(magimixSteps).values({ ...row, recipeId })),
    ...rows.subrecipe.map((row) => db.insert(subrecipeSteps).values({ ...row, recipeId })),
  ]
  if (first) {
    await db.batch([first, ...rest])
  }
}
