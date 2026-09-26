import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import * as z from 'zod'

import { convertRecipes } from './lexical-to-steps.ts'

const ROOT_DIR = join(import.meta.dirname, '../..')
const TARGETS = { '--local': ['--local', '--persist-to', '.wrangler/state'], '--remote': ['--remote'] }
const target = process.argv.find((arg): arg is keyof typeof TARGETS => arg in TARGETS)
if (!target) {
  throw new Error('Usage: db:migrate-steps -- --local | --remote')
}

const executeSql = (args: string[]) =>
  execFileSync(
    'pnpm',
    ['exec', 'wrangler', 'd1', 'execute', 'recipe-organizer', '--config', 'apps/api/wrangler.jsonc', '--yes', ...TARGETS[target], ...args],
    {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      maxBuffer: 1024 ** 3,
      stdio: ['inherit', 'pipe', 'inherit'],
    }
  )

const sqlValue = (value: string | number | undefined) => {
  if (value === undefined) {
    return 'NULL'
  }
  return typeof value === 'number' ? String(value) : `'${value.replaceAll("'", "''")}'`
}
const insert = (table: string, values: Record<string, string | number | undefined>) =>
  `INSERT INTO ${table} (${Object.keys(values).join(', ')}) VALUES (${Object.values(values).map(sqlValue).join(', ')});`

const rowsSchema = z.tuple([z.object({ results: z.array(z.object({ id: z.number(), instructions: z.string() })) })])
const [{ results }] = rowsSchema.parse(JSON.parse(executeSql(['--json', '--command', 'SELECT id, instructions FROM recipes ORDER BY id'])))
const { report, stepGroups } = convertRecipes(results)

const groupId = (recipeId: number, position: number) => `(SELECT id FROM recipe_step_groups WHERE recipe_id = ${recipeId} AND position = ${position})`
const stepId = (recipeId: number, groupPosition: number, position: number) =>
  `(SELECT id FROM recipe_steps WHERE group_id = ${groupId(recipeId, groupPosition)} AND position = ${position})`
const insertStep = (table: string, id: string, values: Record<string, string | number | undefined>) =>
  `INSERT INTO ${table} (step_id, ${Object.keys(values).join(', ')}) VALUES (${id}, ${Object.values(values).map(sqlValue).join(', ')});`

// Rewrites every step on each run so a re-run captures edits made since the last one; deleting groups cascades to steps.
const statements = ['DELETE FROM recipe_step_groups;']
let stepCount = 0
for (const [recipeId, groups] of stepGroups) {
  for (const [groupIndex, group] of groups.entries()) {
    const groupPosition = groupIndex + 1
    statements.push(
      group.kind === 'subrecipe'
        ? insert('recipe_step_groups', { position: groupPosition, recipe_id: recipeId, subrecipe_id: group.recipeId })
        : insert('recipe_step_groups', { is_default: groupIndex === 0 ? 1 : 0, position: groupPosition, recipe_id: recipeId })
    )
    const steps = group.kind === 'steps' ? group.steps : []
    for (const [index, step] of steps.entries()) {
      const position = index + 1
      const id = stepId(recipeId, groupPosition, position)
      stepCount += 1
      statements.push(`INSERT INTO recipe_steps (group_id, position) VALUES (${groupId(recipeId, groupPosition)}, ${position});`)
      statements.push(
        step.kind === 'text'
          ? insertStep('text_steps', id, { text: step.text })
          : insertStep('magimix_steps', id, {
              program: step.program,
              rotation_speed: step.rotationSpeed,
              temperature: step.temperature,
              time: step.time,
            })
      )
    }
  }
}

const dir = mkdtempSync(join(tmpdir(), 'recipe-steps-'))
try {
  const file = join(dir, 'steps.sql')
  writeFileSync(file, statements.join('\n'))
  executeSql(['--file', file])
} finally {
  rmSync(dir, { force: true, recursive: true })
}

process.stdout.write(`Converted ${results.length} recipes into ${stepCount} steps.\n`)
for (const { recipeId, issue } of report) {
  process.stdout.write(`recipe ${recipeId}: ${issue}\n`)
}
