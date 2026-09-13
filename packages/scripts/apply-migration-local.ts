import { exec } from 'node:child_process'
import { copyFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const ROOT_DIR = join(import.meta.dirname, '../..')
const SOURCE_DIR = join(ROOT_DIR, 'apps/api/db/migrations')
const TMP_DIR = join(ROOT_DIR, 'migrations_tmp')

rmSync(TMP_DIR, { force: true, recursive: true })
mkdirSync(TMP_DIR, { recursive: true })

const folders = readdirSync(SOURCE_DIR, { withFileTypes: true })

for (const folder of folders) {
  if (folder.isDirectory()) {
    const folderPath = join(SOURCE_DIR, folder.name)
    const files = readdirSync(folderPath)

    for (const file of files) {
      if (file.endsWith('.sql')) {
        const oldPath = join(folderPath, file)
        const newFileName = `${folder.name}_${file}`
        const newPath = join(TMP_DIR, newFileName)

        copyFileSync(oldPath, newPath)
      }
    }
  }
}

exec('pnpm wrangler d1 migrations apply recipe-organizer --config apps/api/wrangler.jsonc --local --persist-to .wrangler/state', {
  cwd: ROOT_DIR,
}).on('exit', () => rmSync(TMP_DIR, { force: true, recursive: true }))
