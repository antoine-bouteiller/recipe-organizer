// oxlint-disable-next-line import/consistent-type-specifier-style -- an inline type import keeps a runtime import of `cloudflare:workers`, which unit tests cannot load.
import type { getDb } from '@recipe-organizer/api/lib/db'
import { magimixSteps, recipeStep, recipeStepGroup, textSteps } from '@recipe-organizer/api/schema'
import { type RecipeStep, type RecipeStepGroup } from '@recipe-organizer/shared/recipe/schemas'
import { eq, sql } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

type Db = ReturnType<typeof getDb>
type TextStepRow = Pick<typeof textSteps.$inferSelect, 'text'>
type MagimixStepRow = Pick<typeof magimixSteps.$inferSelect, 'program' | 'rotationSpeed' | 'temperature' | 'time'>

interface StepRow {
  readonly magimix: MagimixStepRow | null
  readonly text: TextStepRow | null
}

interface StepGroupRow {
  readonly groupName: string | null
  readonly steps: readonly StepRow[]
  readonly subrecipeId: number | null
}

const rowToStep = ({ magimix, text }: StepRow): RecipeStep => {
  if (text) {
    return { kind: 'text', text: text.text }
  }
  if (!magimix) {
    throw new Error('Step has no kind row')
  }
  return {
    kind: 'magimix',
    program: magimix.program,
    rotationSpeed: magimix.rotationSpeed,
    temperature: magimix.temperature ?? undefined,
    time: magimix.time,
  }
}

export const rowsToStepGroups = (groups: readonly StepGroupRow[]): RecipeStepGroup[] =>
  groups.map((group) =>
    group.subrecipeId === null
      ? { groupName: group.groupName ?? undefined, kind: 'steps', steps: group.steps.map(rowToStep) }
      : { kind: 'subrecipe', recipeId: group.subrecipeId }
  )

export const flattenSteps = (groups: readonly RecipeStepGroup[]): RecipeStep[] =>
  groups.flatMap((group) => (group.kind === 'steps' ? group.steps : []))

// A sub-recipe group is a view onto a declared link, never onto the recipe itself.
export const assertSubrecipeGroups = (groups: readonly RecipeStepGroup[], linkedRecipeIds: readonly number[], recipeId?: number): void => {
  const invalid = groups.some((group) => group.kind === 'subrecipe' && (group.recipeId === recipeId || !linkedRecipeIds.includes(group.recipeId)))
  if (invalid) {
    throw new HTTPException(400, { message: 'Sub-recipe group must reference a linked recipe' })
  }
}

const stepsWith = { orderBy: { position: 'asc' }, with: { magimix: true, text: true } } as const

export const selectRecipeStepGroups = async (db: Db, recipeId: number): Promise<RecipeStepGroup[]> =>
  rowsToStepGroups(await db.query.recipeStepGroup.findMany({ orderBy: { position: 'asc' }, where: { recipeId }, with: { steps: stepsWith } }))

// The steps a sub-recipe group shows.
export const selectDefaultSteps = async (db: Db, recipeId: number): Promise<RecipeStep[]> => {
  const group = await db.query.recipeStepGroup.findFirst({ where: { isDefault: true, recipeId }, with: { steps: stepsWith } })
  return group?.steps.map(rowToStep) ?? []
}

// Steps and kind rows cascade from their group.
export const deleteRecipeSteps = (db: Db, recipeId: number) => db.delete(recipeStepGroup).where(eq(recipeStepGroup.recipeId, recipeId))

// Rows reference their parent through its unique position, so one transactional batch writes the whole graph.
// Single-row statements stay under D1's bound-parameter limit.
export const writeRecipeSteps = async (db: Db, recipeId: number, groups: readonly RecipeStepGroup[]): Promise<void> => {
  const groupId = (position: number) =>
    sql`(select ${recipeStepGroup.id} from ${recipeStepGroup} where ${recipeStepGroup.recipeId} = ${recipeId} and ${recipeStepGroup.position} = ${position})`
  const stepId = (groupPosition: number, position: number) =>
    sql`(select ${recipeStep.id} from ${recipeStep} where ${recipeStep.groupId} = ${groupId(groupPosition)} and ${recipeStep.position} = ${position})`

  const statements = groups.flatMap((group, groupIndex) => {
    const groupPosition = groupIndex + 1
    if (group.kind === 'subrecipe') {
      return [db.insert(recipeStepGroup).values({ position: groupPosition, recipeId, subrecipeId: group.recipeId })]
    }
    return [
      db
        .insert(recipeStepGroup)
        .values({ groupName: groupIndex === 0 ? null : group.groupName || null, isDefault: groupIndex === 0, position: groupPosition, recipeId }),
      ...group.steps.flatMap((step, index) => {
        const position = index + 1
        const id = stepId(groupPosition, position)
        return [
          db.insert(recipeStep).values({ groupId: groupId(groupPosition), position }),
          step.kind === 'text'
            ? db.insert(textSteps).values({ stepId: id, text: step.text })
            : db.insert(magimixSteps).values({
                program: step.program,
                rotationSpeed: step.rotationSpeed,
                stepId: id,
                temperature: step.temperature ?? null,
                time: step.time,
              }),
        ]
      }),
    ]
  })
  const [first, ...rest] = statements
  if (first) {
    await db.batch([first, ...rest])
  }
}
