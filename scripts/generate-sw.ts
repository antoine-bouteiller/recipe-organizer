import path from 'node:path'

import { injectManifest } from '@serwist/build'
import { build, type Plugin } from 'vite-plus'

export const tanstackSerwistPlugin = (): Plugin => {
  let rootDir = ''
  let isProduction = false

  return {
    apply: 'build',
    applyToEnvironment: (env) => env.name === 'client',
    async closeBundle() {
      const outDir = path.resolve(rootDir, 'dist', 'client')
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
          rollupOptions: {
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
        await injectManifest({
          globDirectory: outDir,
          globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest,woff,woff2}'],
          injectionPoint: 'self.__SW_MANIFEST',
          swDest,
          swSrc: swDest,
        })
      }
    },
    configResolved(config) {
      ;({ isProduction, root: rootDir } = config)
    },
    enforce: 'post',
    name: 'tanstack-serwist',
  }
}
