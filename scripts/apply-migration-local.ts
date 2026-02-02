import { $ } from 'bun'
import { copyFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const SOURCE_DIR = 'migrations'
const TMP_DIR = 'migrations_tmp'

rmSync(TMP_DIR, { recursive: true, force: true })
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

await $`wrangler d1 migrations apply recipe-organizer`
rmSync(TMP_DIR, { recursive: true, force: true })
