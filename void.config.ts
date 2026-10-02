import { defineConfig } from 'void/config'

// Runs before first paint on server-rendered and island pages alike.
const themeScript = `document.documentElement.className = /(?:^|; )ui-theme=dark(?:;|$)/.test(document.cookie) || (!/(?:^|; )ui-theme=/.test(document.cookie) && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'`
// Island pages navigate across documents; mark backward traversals so the CSS can reverse the slide.
const backTransitionScript = `addEventListener('pagereveal', (event) => { const activation = globalThis.navigation?.activation; if (event.viewTransition && activation?.navigationType === 'traverse' && activation.entry.index < (activation.from?.index ?? 0)) event.viewTransition.types.add('back') })`
const serviceWorkerScript = `if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js', { scope: '/', type: 'module' }).catch(() => undefined)`

// Keep resource IDs in sync with packages/server/wrangler.jsonc (local migrations, dump/import) and packages/server/src/env.d.ts.
const voidConfig = defineConfig({
  cloudflare: {
    d1_databases: [{ binding: 'DB', database_id: '542863e2-5f6d-4ef7-9fd0-84b673f76f43', database_name: 'recipe-organizer' }],
    images: { binding: 'IMAGES' },
    // VITE_PUBLIC_URL and the auth secrets are dashboard-managed.
    keep_vars: true,
    name: 'recipe-organizer',
    observability: { logs: { enabled: true, invocation_logs: true }, traces: { enabled: false } },
    preview_urls: false,
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
