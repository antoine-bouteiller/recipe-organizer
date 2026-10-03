import { defineConfig } from 'void/config'

// Runs before first paint on server-rendered and island pages alike.
const themeScript = `document.documentElement.className = /(?:^|; )ui-theme=dark(?:;|$)/.test(document.cookie) || (!/(?:^|; )ui-theme=/.test(document.cookie) && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'`
// Void starts client transitions without direction types; document transitions need both snapshots tagged.
const backTransitionScript = `(() => {
  const navigation = globalThis.navigation
  if (!navigation) return
  const isBack = (activation) => activation?.navigationType === 'traverse' && activation.entry.index < (activation.from?.index ?? 0)
  addEventListener('pageswap', (event) => {
    if (event.viewTransition && isBack(event.activation)) event.viewTransition.types.add('back')
  })
  addEventListener('pagereveal', (event) => {
    if (event.viewTransition && isBack(navigation.activation)) event.viewTransition.types.add('back')
  })
  if (!document.startViewTransition) return
  let back = false
  navigation.addEventListener('navigate', (event) => {
    back = !event.hashChange && event.navigationType === 'traverse' && event.destination.index < navigation.currentEntry.index
  })
  const startViewTransition = document.startViewTransition.bind(document)
  document.startViewTransition = (update) => {
    const transition = startViewTransition(update)
    if (back) transition.types?.add('back')
    back = false
    return transition
  }
})()`
const serviceWorkerScript = `if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js', { scope: '/', type: 'module' }).catch(() => undefined)`

// Keep resource IDs in sync with tools/wrangler.jsonc (local migrations, dump/import) and src/lib/server/env.d.ts.
const voidConfig = defineConfig({
  cloudflare: {
    d1_databases: [{ binding: 'DB', database_id: '542863e2-5f6d-4ef7-9fd0-84b673f76f43', database_name: 'recipe-organizer' }],
    images: { binding: 'IMAGES' },
    // VITE_PUBLIC_URL and the auth secrets are dashboard-managed.
    keep_vars: true,
    name: 'recipe-organizer',
    observability: { logs: { enabled: true, invocation_logs: true }, traces: { enabled: false } },
    preview_urls: true,
    r2_buckets: [{ binding: 'R2_BUCKET', bucket_name: 'recipe-organizer' }],
    routes: [{ custom_domain: true, pattern: 'recipes.antoinebouteiller.fr' }],
    workers_dev: false,
  },
  head: {
    htmlAttrs: { lang: 'fr' },
    link: [
      { href: '/manifest.json', rel: 'manifest' },
      { href: '/favicon.ico', rel: 'icon' },
    ],
    meta: [
      { content: 'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content', name: 'viewport' },
      { content: '#0e6e7e', name: 'theme-color' },
    ],
    script: [{ innerHTML: themeScript }, { innerHTML: backTransitionScript }, { innerHTML: serviceWorkerScript }],
    title: 'Recipe Organizer',
  },
  inference: { appType: 'void', bindings: { ai: false, db: 'DB', kv: false, storage: 'R2_BUCKET' } },
  routing: { isr: false },
  worker: { compatibility_date: '2026-01-28', compatibility_flags: ['nodejs_compat'] },
})

export default voidConfig
