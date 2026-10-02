import { FetchError } from 'void/client'
import * as z from 'zod'

const errorSchema = z.object({ error: z.string() })

/** Reads the `{ error }` message of a failed API or page-action response. */
export const getErrorMessage = (body: unknown) => {
  const parsed = errorSchema.safeParse(body)
  return parsed.success ? parsed.data.error : 'Une erreur est survenue'
}

export const readResponse = async <TResponse>(request: Promise<TResponse>): Promise<TResponse> => {
  try {
    return await request
  } catch (error) {
    if (!(error instanceof FetchError) || error.status === undefined) {
      throw error
    }
    const message = getErrorMessage(error.data)
    if (error.status === 401) {
      globalThis.location.assign('/auth/login')
    }
    if (error.status === 403 && (message === 'account_blocked' || message === 'account_pending')) {
      globalThis.location.assign(`/auth/login?error=${message}`)
    }
    throw new Error(error.status === 400 ? 'Invalid Schema' : message, { cause: error })
  }
}
