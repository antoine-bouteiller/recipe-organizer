import { readResponse } from '@client/lib/api-client'
import { fetch } from 'void/client'

const getRecipesByIds = (ids: readonly number[]) => readResponse(fetch('/api/shopping-list/recipes', { query: { ids: JSON.stringify(ids) } }))

const requests = new Map<string, ReturnType<typeof getRecipesByIds>>()

/** One request per distinct selection; `use()` needs the same promise across renders. */
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
