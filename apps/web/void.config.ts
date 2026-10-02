import { defineConfig } from 'void/config'

// Keep resource IDs in sync with server/wrangler.jsonc (local migrations, dump/import) and server/env.d.ts.
const voidConfig = defineConfig({
  cloudflare: {
    d1_databases: [{ binding: 'DB', database_id: '542863e2-5f6d-4ef7-9fd0-84b673f76f43', database_name: 'recipe-organizer' }],
    images: { binding: 'IMAGES' },
    // VITE_PUBLIC_URL and the auth secrets are dashboard-managed.
    keep_vars: true,
    name: 'recipe-organizer',
    observability: { logs: { enabled: true, invocation_logs: true }, traces: { enabled: false } },
    r2_buckets: [{ binding: 'R2_BUCKET', bucket_name: 'recipe-organizer' }],
  },
  inference: { appType: 'void', bindings: { ai: false, db: 'DB', kv: false, storage: 'R2_BUCKET' } },
  routing: { isr: false },
  worker: { compatibility_date: '2026-01-28', compatibility_flags: ['nodejs_compat'] },
})

export default voidConfig
