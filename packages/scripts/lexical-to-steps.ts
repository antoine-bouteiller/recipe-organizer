import { allowedRotationSpeed, magimixProgram } from '@recipe-organizer/shared/recipe/magimix'
// oxlint-disable-next-line import/consistent-type-specifier-style -- Node runs this script; an inline type import would load schemas.ts, whose extensionless imports Node cannot resolve.
import type { RecipeStep } from '@recipe-organizer/shared/recipe/schemas'
import * as z from 'zod'

interface LexicalNode {
  children?: LexicalNode[]
  format?: number | string
  hideFirstNodes?: number
  hideLastNodes?: number
  program?: string
  recipeId?: number
  rotationSpeed?: string
  temperature?: number | null
  text?: string
  time?: number
  type: string
}

const lexicalNodeSchema: z.ZodType<LexicalNode> = z.lazy(() =>
  z.looseObject({
    children: z.array(lexicalNodeSchema).optional(),
    format: z.union([z.number(), z.string()]).optional(),
    hideFirstNodes: z.number().optional(),
    hideLastNodes: z.number().optional(),
    program: z.string().optional(),
    recipeId: z.number().optional(),
    rotationSpeed: z.string().optional(),
    temperature: z.number().nullish(),
    text: z.string().optional(),
    time: z.number().optional(),
    type: z.string(),
  })
)
const lexicalStateSchema = z.object({ root: lexicalNodeSchema })

interface ReportEntry {
  issue: string
  recipeId: number
}

// A sub-recipe step before its source's node→step mapping is known.
interface PendingSubrecipe {
  hideFirstNodes: number
  hideLastNodes: number
  kind: 'pending-subrecipe'
  recipeId: number
}

interface ConvertedRecipe {
  // Steps produced by each root node, in document order.
  nodeSteps: (RecipeStep | PendingSubrecipe)[][]
}

type SubrecipeStep = Extract<RecipeStep, { kind: 'subrecipe' }>

const BOLD = 1
const TEXT_BLOCKS = new Set(['heading', 'paragraph', 'quote'])

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(value)))

const textStep = (text: string): RecipeStep[] => (text.trim() ? [{ kind: 'text', text: text.trim() }] : [])

const parseJson = (instructions: string): unknown => {
  try {
    return JSON.parse(instructions)
  } catch {
    return undefined
  }
}

const convertRecipe = (instructions: string, report: (issue: string) => void): ConvertedRecipe => {
  if (!instructions.trim()) {
    return { nodeSteps: [] }
  }

  const json = parseJson(instructions)
  if (json === undefined) {
    report('instructions are not Lexical JSON; kept as one text step')
    return { nodeSteps: [textStep(instructions)] }
  }
  // Throws on an unexpected Lexical shape so the run stops instead of losing data.
  const { root } = lexicalStateSchema.parse(json)

  const inline = (nodes: LexicalNode[] = []): string =>
    nodes
      .map((node) => {
        if (node.type === 'text') {
          const text = node.text ?? ''
          const format = typeof node.format === 'number' ? node.format : 0
          if (format & ~BOLD) {
            report(`dropped text format ${format & ~BOLD}`)
          }
          // Bold wraps the trimmed text so surrounding spaces stay outside the delimiters.
          return format & BOLD && text.trim() ? text.replace(text.trim(), (core) => `**${core}**`) : text
        }
        if (node.type === 'linebreak') {
          return '\n'
        }
        if (node.type === 'tab') {
          return '\t'
        }
        report(`unknown inline node "${node.type}" converted to text`)
        return inline(node.children)
      })
      .join('')
      // Adjacent bold runs merge: `**a****b**` → `**ab**`.
      .replaceAll('****', '')

  const listSteps = (list: LexicalNode): RecipeStep[] =>
    (list.children ?? []).flatMap((item) => [
      ...textStep(inline(item.children?.filter((child) => child.type !== 'list'))),
      ...(item.children ?? []).filter((child) => child.type === 'list').flatMap(listSteps),
    ])

  const magimixStep = (node: LexicalNode): RecipeStep => {
    const program = magimixProgram.find((value) => value === node.program)
    const rotationSpeed = allowedRotationSpeed.find((value) => value === node.rotationSpeed)
    const time = clamp(node.time ?? 0, 1, 3660)
    const step: RecipeStep = { kind: 'magimix', program: program ?? 'expert', rotationSpeed: rotationSpeed ?? 'auto', time }
    if (node.temperature !== null && node.temperature !== undefined) {
      step.temperature = clamp(node.temperature, 0, 200)
    }
    if (!program || !rotationSpeed || time !== node.time || step.temperature !== (node.temperature ?? undefined)) {
      report(
        `adjusted Magimix step ${JSON.stringify({ program: node.program, rotationSpeed: node.rotationSpeed, temperature: node.temperature, time: node.time })}`
      )
    }
    return step
  }

  const nodeSteps = (root.children ?? []).map((node): (RecipeStep | PendingSubrecipe)[] => {
    if (TEXT_BLOCKS.has(node.type)) {
      return textStep(inline(node.children))
    }
    if (node.type === 'list') {
      return listSteps(node)
    }
    if (node.type === 'magimixProgram') {
      return [magimixStep(node)]
    }
    if (node.type === 'subrecipe') {
      return [
        { hideFirstNodes: node.hideFirstNodes ?? 0, hideLastNodes: node.hideLastNodes ?? 0, kind: 'pending-subrecipe', recipeId: node.recipeId ?? 0 },
      ]
    }
    report(`unknown node "${node.type}" converted to text`)
    return textStep(inline(node.children))
  })

  return { nodeSteps }
}

/**
 * Maps legacy hide counts over the source's root nodes to an inclusive 1-based step range.
 * Mirrors the legacy renderer, which showed root nodes `[hideFirst, length - 1 - hideLast)`.
 */
const resolveRange = (source: ConvertedRecipe, pending: PendingSubrecipe, report: (issue: string) => void): SubrecipeStep => {
  const counts = source.nodeSteps.map((steps) => steps.length)
  const total = counts.reduce((sum, count) => sum + count, 0)
  const stepsBefore = (nodeIndex: number) => counts.slice(0, Math.max(0, nodeIndex)).reduce((sum, count) => sum + count, 0)
  const from = stepsBefore(pending.hideFirstNodes) + 1
  const to = stepsBefore(counts.length - 1 - pending.hideLastNodes)
  const step: SubrecipeStep = { kind: 'subrecipe', recipeId: pending.recipeId }

  if ((counts.at(-1) ?? 0) > 0) {
    report(`sub-recipe ${pending.recipeId}: legacy renderer also hid the source's last node; kept hidden`)
  }
  if (from > to) {
    if (total > 0) {
      report(`sub-recipe ${pending.recipeId}: empty range; points past the source's last step`)
      step.fromStep = total + 1
      step.toStep = total + 1
    }
    return step
  }
  if (from !== 1) {
    step.fromStep = from
  }
  if (to !== total) {
    step.toStep = to
  }
  return step
}

export const convertRecipes = (rows: { id: number; instructions: string }[]) => {
  const report: ReportEntry[] = []
  const seen = new Set<string>()
  const reporter = (recipeId: number) => (issue: string) => {
    const key = `${recipeId}:${issue}`
    if (!seen.has(key)) {
      seen.add(key)
      report.push({ issue, recipeId })
    }
  }

  const converted = new Map(rows.map((row) => [row.id, convertRecipe(row.instructions, reporter(row.id))]))
  const steps = new Map<number, RecipeStep[]>()

  for (const [id, recipe] of converted) {
    const recipeReport = reporter(id)
    steps.set(
      id,
      recipe.nodeSteps.flat().flatMap((step) => {
        if (step.kind !== 'pending-subrecipe') {
          return [step]
        }
        const source = converted.get(step.recipeId)
        if (!source) {
          recipeReport(`sub-recipe ${step.recipeId} does not exist; step dropped`)
          return []
        }
        return [resolveRange(source, step, recipeReport)]
      })
    )
  }

  return { report, steps }
}
