import { readResponse } from '@client/lib/api-client'
import { fetch } from 'void/client'

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

  return pending
}

export const resetAuthUserCache = () => {
  pending = undefined
}

export const getAuthUser = async () => (await readResponse(fetch('/api/session'))) ?? undefined
