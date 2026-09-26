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
const { report, steps } = convertRecipes(results)

// Rewrites every step on each run so a re-run captures edits made since the last one.
const statements = ['DELETE FROM text_steps;', 'DELETE FROM magimix_steps;', 'DELETE FROM subrecipe_steps;']
for (const [recipeId, recipeSteps] of steps) {
  for (const [index, step] of recipeSteps.entries()) {
    const base = { position: index + 1, recipe_id: recipeId }
    if (step.kind === 'text') {
      statements.push(insert('text_steps', { ...base, text: step.text }))
    } else if (step.kind === 'magimix') {
      statements.push(
        insert('magimix_steps', {
          ...base,
          program: step.program,
          rotation_speed: step.rotationSpeed,
          temperature: step.temperature,
          time: step.time,
        })
      )
    } else {
      statements.push(insert('subrecipe_steps', { ...base, from_step: step.fromStep, subrecipe_id: step.recipeId, to_step: step.toStep }))
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

process.stdout.write(`Converted ${results.length} recipes into ${statements.length - 3} steps.\n`)
for (const { recipeId, issue } of report) {
  process.stdout.write(`recipe ${recipeId}: ${issue}\n`)
}
