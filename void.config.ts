import { defineConfig } from 'void/config'

// Worker name, account and D1/R2 resources are recorded in void.lock.json; keep tools/wrangler.jsonc and src/lib/server/env.d.ts in sync.
const voidConfig = defineConfig({
  cloudflare: {
    images: { binding: 'IMAGES' },
    // The auth secrets are dashboard-managed.
    keep_vars: true,
    observability: { logs: { enabled: true, invocation_logs: true }, traces: { enabled: false } },
    preview_urls: true,
    routes: [{ custom_domain: true, pattern: 'recipes.antoinebouteiller.fr' }],
    workers_dev: false,
  },
  inference: { bindings: { db: true } },
  routing: {
    // Native Cloudflare deploys only mark JS immutable; CSS and fonts would revalidate on every document navigation.
    headers: { '/assets/*': ['Cache-Control: public, max-age=31536000, immutable'] },
  },
  worker: { compatibility_date: '2026-01-28', compatibility_flags: ['nodejs_compat'] },
})

export default voidConfig
