type Env = {
  DB: D1Database
  S3_ACCESS_KEY: string
  S3_SECRET_KEY: string
  S3_URL: string
  R2_BUCKET: R2Bucket
}

let cachedEnv: Env | null = null

// This gets called once at startup when running locally
const initDevEnv = async () => {
  const { getPlatformProxy } = await import('wrangler')
  const proxy = await getPlatformProxy()
  cachedEnv = proxy.env as unknown as Env
}

if (import.meta.env.DEV) {
  await initDevEnv()
}

/**
 * Will only work when being accessed on the server. Obviously, CF bindings are not available in the browser.
 * @returns
 */
export function getBindings(): Env {
  if (import.meta.env.DEV) {
    if (!cachedEnv) {
      throw new Error('Dev bindings not initialized yet. Call initDevEnv() first.')
    }
    return cachedEnv
  }

  return process.env as unknown as Env
}
