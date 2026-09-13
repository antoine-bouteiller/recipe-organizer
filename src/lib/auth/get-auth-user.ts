import { apiClient, readResponse } from '@/lib/api-client'

let pending: ReturnType<typeof getAuthUser> | undefined = undefined

// Client-only by design: module scope on Workers is shared across requests, so caching a session there leaks it between users.
export const loadAuthUser = () => {
  if (import.meta.env.SSR || globalThis.window === undefined) {
    return getAuthUser()
  }

  if (!pending) {
    const request = getAuthUser()
    pending = request
    // Never pin a rejected promise: without this a single network blip breaks every later navigation.
    request.catch(() => {
      if (pending === request) {
        pending = undefined
      }
    })
  }

  return pending
}

export const resetAuthUserCache = () => {
  pending = undefined
}

export const getAuthUser = async () => (await readResponse(apiClient.session.$get())) ?? undefined
