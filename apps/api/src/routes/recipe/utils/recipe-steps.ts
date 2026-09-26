import type { getDb } from '@recipe-organizer/api/lib/db'
import { magimixSteps, recipeStep, recipeStepGroup } from '@recipe-organizer/api/schema'
import type { RecipeStep, RecipeStepGroup } from '@recipe-organizer/shared/recipe/schemas'
import { eq, sql } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

type Db = ReturnType<typeof getDb>
type MagimixStepRow = Pick<typeof magimixSteps.$inferSelect, 'program' | 'rotationSpeed' | 'temperature' | 'time'>

interface StepRow {
  readonly magimix: MagimixStepRow | null
  readonly text: string
}

interface StepGroupRow {
  readonly groupName: string | null
  readonly steps: readonly StepRow[]
  readonly subrecipeId: number | null
}

const rowToStep = ({ magimix, text }: StepRow): RecipeStep => ({
  magimix: magimix
    ? { program: magimix.program, rotationSpeed: magimix.rotationSpeed, temperature: magimix.temperature ?? undefined, time: magimix.time }
    : undefined,
  text,
})

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

const stepsWith = { orderBy: { position: 'asc' }, with: { magimix: true } } as const

export const selectRecipeStepGroups = async (db: Db, recipeId: number): Promise<RecipeStepGroup[]> =>
  rowsToStepGroups(await db.query.recipeStepGroup.findMany({ orderBy: { position: 'asc' }, where: { recipeId }, with: { steps: stepsWith } }))

// The steps a sub-recipe group shows.
export const selectDefaultSteps = async (db: Db, recipeId: number): Promise<RecipeStep[]> => {
  const group = await db.query.recipeStepGroup.findFirst({ where: { isDefault: true, recipeId }, with: { steps: stepsWith } })
  return group?.steps.map(rowToStep) ?? []
}

// Steps and their Magimix rows cascade from their group.
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
        const { magimix } = step
        return [
          db.insert(recipeStep).values({ groupId: groupId(groupPosition), position, text: step.text }),
          ...(magimix
            ? [
                db.insert(magimixSteps).values({
                  program: magimix.program,
                  rotationSpeed: magimix.rotationSpeed,
                  stepId: stepId(groupPosition, position),
                  temperature: magimix.temperature ?? null,
                  time: magimix.time,
                }),
              ]
            : []),
        ]
      }),
    ]
  })
  const [first, ...rest] = statements
  if (first) {
    await db.batch([first, ...rest])
  }
}
