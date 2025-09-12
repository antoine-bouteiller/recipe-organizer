import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PluginContext } from 'rolldown'
import type { PluginOption } from 'vite'
import { generateSW } from 'workbox-build'

const workboxGenerate = async (context: PluginContext) => {
  const clientDist = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '.tanstack/start/build/client-dist'
  )
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
    context.warn(warnings.join('\n'))
  }
  context.info(`generated sw.js with ${count} precached files (${(size / 1024).toFixed(1)} KiB)`)
}

const workboxGeneratePlugin: () => PluginOption = () => ({
  name: 'workbox-generate',
  applyToEnvironment(environment) {
    return environment.name === 'ssr'
  },
  async buildStart(this: PluginContext) {
    await workboxGenerate(this)
  },
})

export { workboxGeneratePlugin }
