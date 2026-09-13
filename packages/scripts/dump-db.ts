import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { getPlatformProxy } from 'wrangler'

const ROOT_DIR = join(import.meta.dirname, '../..')
const { env, dispose } = await getPlatformProxy<Env>({
  configPath: join(ROOT_DIR, 'apps/api/wrangler.jsonc'),
  persist: { path: join(ROOT_DIR, '.wrangler/state/v3') },
  remoteBindings: false,
})

try {
  const [statements] = await env.DB.prepare('PRAGMA miniflare_d1_export(?, ?);').bind(1, 0).raw<string[]>()
  writeFileSync(join(ROOT_DIR, 'database.sql'), statements.join('\n'))
} finally {
  await dispose()
}
