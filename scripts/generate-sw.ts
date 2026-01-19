/* oxlint-disable no-console, init-declarations, prefer-destructuring */
import type { Plugin } from 'vite'

import { injectManifest } from '@serwist/build'
import path from 'node:path'
import { build } from 'vite'

/**
 * Custom Serwist plugin for TanStack Start
 * Builds service worker in both dev and production modes
 */
export const tanstackSerwistPlugin = (): Plugin => {
  let rootDir: string
  let isProduction: boolean

  return {
    name: 'tanstack-serwist',
    configResolved(config) {
      rootDir = config.root
      isProduction = config.isProduction
    },
    async buildStart() {
      // Build service worker in dev mode
      if (!isProduction) {
        await buildServiceWorker(rootDir, false)
      }
    },
    async closeBundle() {
      // Build service worker in production mode
      if (isProduction) {
        await buildServiceWorker(rootDir, true)
      }
    },
  }
}

const buildServiceWorker = async (rootDir: string, production: boolean) => {
  const outName = 'sw.js'
  const outDir = production ? path.resolve(rootDir, 'dist', 'client') : path.resolve(rootDir, 'public')
  const swSrc = path.resolve(rootDir, 'src', 'sw.ts')
  const swDest = path.resolve(outDir, outName)
  const env = production ? 'production' : 'dev'

  console.log(`\n🔧 [SERWIST] Building service worker (${env})...`)

  try {
    await build({
      root: rootDir,
      configFile: false,
      define: {
        'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      },
      build: {
        lib: {
          entry: swSrc,
          formats: ['es'],
          fileName: () => outName,
        },
        outDir,
        emptyOutDir: false,
        minify: production,
        rollupOptions: {
          output: {
            entryFileNames: outName,
          },
        },
      },
      logLevel: 'error',
    })

    // Step 2: Inject the precache manifest (only in production)
    if (production) {
      const result = await injectManifest({
        swSrc: swDest,
        swDest,
        globDirectory: outDir,
        globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest,woff,woff2}'],
        injectionPoint: 'self.__SW_MANIFEST',
      })

      const cacheSize = (result.size / 1024 / 1024).toFixed(2)

      console.log(`✅ [SERWIST] Precached ${result.count} files (${cacheSize} MB)`)
    } else {
      console.log('✅ [SERWIST] Dev service worker built')
    }
  } catch (error) {
    console.error('❌ [SERWIST] Failed to build service worker:', error)
    throw error
  }
}
