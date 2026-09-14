import type * as server from '@recipe-organizer/api'
import { notFound, redirect } from '@tanstack/react-router'
import { hc, parseResponse, type ClientResponse } from 'hono/client'

export const apiClient = hc<typeof server.api>('/', { init: { credentials: 'same-origin' } }).api

const isErrorResponse = (body: unknown): body is { error: string } =>
  typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string'

export const readResponse = async <TResponse extends ClientResponse<unknown>>(request: Promise<TResponse>) => {
  const response = await request
  if (!response.ok) {
    const body: unknown = await response.json()
    const error = isErrorResponse(body) ? body.error : 'Une erreur est survenue'
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
