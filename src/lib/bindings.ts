interface Env {
  DB: D1Database
  R2_BUCKET: R2Bucket
  RESEND_API_KEY: string
  IMAGES: ImagesBinding
}

let cachedEnv: Env | undefined = undefined

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
export const getBindings = (): Env => {
  if (import.meta.env.DEV) {
    if (!cachedEnv) {
      throw new Error('Dev bindings not initialized yet. Call initDevEnv() first.')
    }
    return cachedEnv
  }

  return process.env as unknown as Env
}
