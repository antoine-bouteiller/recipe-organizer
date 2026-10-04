import { fetch } from 'void/client'

import { readResponse } from '@/lib/client/api-client'

const getRecipesByIds = (ids: readonly number[]) => readResponse(fetch('/api/shopping-list/recipes', { query: { ids: JSON.stringify(ids) } }))

const requests = new Map<string, ReturnType<typeof getRecipesByIds>>()

/** One stable request per distinct selection; failed requests are evicted so callers can retry. */
export const loadRecipesByIds = (ids: readonly number[]) => {
  const key = JSON.stringify(ids)
  let request = requests.get(key)
  if (!request) {
    request = getRecipesByIds(ids)
    requests.set(key, request)
    request.catch(() => requests.delete(key))
  }
  return request
}
