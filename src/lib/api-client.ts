import { notFound, redirect } from '@tanstack/react-router'
import { FetchError } from 'void/client'
import * as z from 'zod'

const errorSchema = z.object({ error: z.string() })

export const readResponse = async <TResponse>(request: Promise<TResponse>): Promise<TResponse> => {
  try {
    return await request
  } catch (error) {
    if (!(error instanceof FetchError) || error.status === undefined) {
      throw error
    }
    const parsed = errorSchema.safeParse(error.data)
    const message = parsed.success ? parsed.data.error : 'Une erreur est survenue'
    if (error.status === 401) {
      throw redirect({ to: '/auth/login' })
    }
    if (error.status === 403 && (message === 'account_blocked' || message === 'account_pending')) {
      throw redirect({ search: { error: message }, to: '/auth/login' })
    }
    if (error.status === 404) {
      throw notFound()
    }
    throw new Error(error.status === 400 ? 'Invalid Schema' : message, { cause: error })
  }
}
