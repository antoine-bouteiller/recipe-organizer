import { apiClient, readResponse } from '@client/lib/api-client'

let pending: ReturnType<typeof getAuthUser> | undefined = undefined

export const loadAuthUser = () => {
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

  return pending.catch((error: unknown) => {
    // A cold offline visit can read public cached recipes without replaying a session.
    if (!navigator.onLine) {
      return undefined
    }
    throw error
  })
}

export const resetAuthUserCache = () => {
  pending = undefined
}

export const getAuthUser = async () => (await readResponse(apiClient.session.$get())) ?? undefined
