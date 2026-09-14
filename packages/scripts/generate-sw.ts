import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { injectManifest } from '@serwist/build'
import { build, type Plugin } from 'vite-plus'

interface ViteManifestEntry {
  assets?: string[]
  css?: string[]
  dynamicImports?: string[]
  file: string
  imports?: string[]
  isEntry?: boolean
}

type ViteManifest = Record<string, ViteManifestEntry>

const shellFiles = [
  'index.html',
  'manifest.json',
  'favicon.ico',
  'icon-192.png',
  'icon-512.png',
  'fonts/bricolage-grotesque-latin.woff2',
  'fonts/bricolage-grotesque-latin-ext.woff2',
]

/**
 * Returns the initial application's and public homepage's static dependency
 * graphs. Other dynamic imports remain on-demand, rather than making every lazy
 * route an install-time download.
 */
export const getInitialPrecacheFiles = (manifest: ViteManifest): string[] => {
  const entryKeys = Object.keys(manifest)
    .filter((key) => manifest[key]?.isEntry || key.split('?')[0]?.endsWith('/routes/index.tsx'))
    .toSorted()
  const pending = entryKeys
  const visited = new Set<string>()
  const files = new Set(shellFiles)

  while (pending.length > 0) {
    const key = pending.pop()
    if (key && !visited.has(key)) {
      visited.add(key)
      const entry = manifest[key]
      if (entry) {
        files.add(entry.file)
        for (const file of [...(entry.assets ?? []), ...(entry.css ?? [])]) {
          files.add(file)
        }
        pending.push(...(entry.imports ?? []))
      }
    }
  }

  return [...files].toSorted()
}

export const serwistPlugin = (): Plugin => {
  let rootDir = ''
  let outDir = ''
  let isProduction = false

  return {
    apply: 'build',
    applyToEnvironment: (env) => env.name === 'client',
    async closeBundle() {
      const swSrc = path.resolve(rootDir, 'src', 'sw.ts')
      const swDest = path.resolve(outDir, 'sw.js')

      await build({
        build: {
          emptyOutDir: false,
          lib: {
            entry: swSrc,
            fileName: () => 'sw.js',
            formats: ['iife'],
            name: 'app',
          },
          minify: isProduction,
          outDir,
          rolldownOptions: {
            output: {
              entryFileNames: 'sw.js',
            },
          },
        },
        configFile: false,
        define: {
          'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        },
        logLevel: 'error',
        root: rootDir,
      })

      if (isProduction) {
        const manifestPath = path.join(outDir, '.vite', 'manifest.json')
        const manifest: ViteManifest = JSON.parse(await readFile(manifestPath, 'utf8'))
        await injectManifest({
          dontCacheBustURLsMatching: /^assets\/.*-[\w-]+\.(?:js|css)$/,
          globDirectory: outDir,
          globPatterns: getInitialPrecacheFiles(manifest),
          injectionPoint: 'self.__SW_MANIFEST',
          swDest,
          swSrc: swDest,
        })
      }
    },
    configResolved(config) {
      ;({ isProduction, root: rootDir } = config)
      outDir = path.resolve(rootDir, config.environments.client.build.outDir)
    },
    enforce: 'post',
    name: 'serwist',
  }
}
