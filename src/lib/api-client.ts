import { notFound, redirect } from '@tanstack/react-router'
import { hc, parseResponse, type ClientResponse } from 'hono/client'
import * as z from 'zod'

import { type api } from '@/lib/api'

export const apiClient = hc<typeof api>('/', { init: { credentials: 'same-origin' } }).api

const errorSchema = z.object({ error: z.string() })

export const readResponse = async <TResponse extends ClientResponse<unknown>>(request: Promise<TResponse>) => {
  const response = await request
  if (!response.ok) {
    const body: unknown = await response.json()
    const parsed = errorSchema.safeParse(body)
    const error = parsed.success ? parsed.data.error : 'Une erreur est survenue'
    if (response.status === 401) {
      throw redirect({ to: '/auth/login' })
    }
    if (response.status === 403 && (error === 'account_blocked' || error === 'account_pending')) {
      throw redirect({ search: { error }, to: '/auth/login' })
    }
    if (response.status === 404) {
      throw notFound()
    }
    throw new Error(response.status === 400 ? 'Invalid Schema' : error)
  }
  return parseResponse(response)
}
