import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vite-plus/test'

const routesDirectory = fileURLToPath(new URL('../routes/', import.meta.url))
const routeFiles = readdirSync(routesDirectory, { encoding: 'utf8', recursive: true })

describe('route presentation boundary', () => {
  it('keeps styles outside the routes directory', () => {
    expect(routeFiles.filter((file) => file.includes('.css'))).toEqual([])
  })

  it('composes styled components without route-owned styling', () => {
    for (const file of routeFiles.filter((name) => name.endsWith('.tsx'))) {
      const source = readFileSync(`${routesDirectory}/${file}`, 'utf8')
      expect(source, file).not.toMatch(/['"][^'"]*\.css(?:\.ts)?['"]|\s(?:className|style)\s*=/)
    }
  })
})
