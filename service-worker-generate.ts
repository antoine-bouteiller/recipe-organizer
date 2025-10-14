import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PluginOption } from 'vite'
import { generateSW } from 'workbox-build'

const workboxGeneratePlugin: () => PluginOption = () => ({
  name: 'workbox-generate',
  applyToEnvironment(environment) {
    return environment.name === 'ssr'
  },
  async buildStart(this) {
    const clientDist = resolve(dirname(fileURLToPath(import.meta.url)), 'dist/client')
    const swDest = resolve(clientDist, 'sw.js')

    const { count, size, warnings } = await generateSW({
      globDirectory: clientDist,
      sourcemap: false,
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      globIgnores: ['sw.js', '**/*.map'],
      globPatterns: ['**/*.{html,js,css}', '**/*.{png,svg,ico,webp,avif,jpg,jpeg}'],
      swDest,
    })

    if (warnings.length) {
      this.warn(warnings.join('\n'))
    }
    this.info(`generated sw.js with ${count} precached files (${(size / 1024).toFixed(1)} KiB)`)
  },
})

export { workboxGeneratePlugin }
