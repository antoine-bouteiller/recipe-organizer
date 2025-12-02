import type { PluginOption } from 'vite'

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateSW } from 'workbox-build'

const workboxGeneratePlugin: () => PluginOption = () => ({
  applyToEnvironment(environment) {
    return environment.name === 'ssr'
  },
  async buildStart(this) {
    const clientDist = resolve(dirname(fileURLToPath(import.meta.url)), 'dist/client')
    const swDest = resolve(clientDist, 'sw.js')

    const { count, size, warnings } = await generateSW({
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      globDirectory: clientDist,
      globIgnores: ['sw.js', '**/*.map'],
      globPatterns: ['**/*.{html,js,css}', '**/*.{png,svg,ico,webp,avif,jpg,jpeg}'],
      skipWaiting: true,
      sourcemap: false,
      swDest,
    })

    if (warnings.length) {
      this.warn(warnings.join('\n'))
    }
    this.info(`generated sw.js with ${count} precached files (${(size / 1024).toFixed(1)} KiB)`)
  },
  name: 'workbox-generate',
})

export { workboxGeneratePlugin }
