import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vite-plus/test'

const pagesDirectory = fileURLToPath(new URL('../../pages/', import.meta.url))
const pageFiles = readdirSync(pagesDirectory, { encoding: 'utf8', recursive: true })

describe('page presentation boundary', () => {
  it('keeps styles outside the pages directory', () => {
    expect(pageFiles.filter((file) => file.includes('.css'))).toEqual([])
  })

  it('composes styled components without page-owned styling', () => {
    for (const file of pageFiles.filter((name) => name.endsWith('.tsx'))) {
      const source = readFileSync(`${pagesDirectory}/${file}`, 'utf8')
      // Layouts load the global stylesheets; everything else composes styled components.
      const imports = /(?:^|\/)layout(?:\.island)?\.tsx$/.test(file) ? source.replaceAll(/import '@\/design-system\/[\w.]+\.css'/g, '') : source
      expect(imports, file).not.toMatch(/['"][^'"]*\.css(?:\.ts)?['"]|\s(?:className|style)\s*=/)
    }
  })
})
