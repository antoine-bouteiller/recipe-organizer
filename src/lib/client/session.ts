import { queryOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import { readResponse } from '@/lib/client/api-client'
import { queryKeys } from '@/lib/client/query-keys'

// An anonymous visitor gets an empty 204 response; queries cannot hold `undefined`.
const getSession = async () => (await readResponse(fetch('/api/session'))) ?? null

/** Read once per document: signing in or out reloads it. */
export const sessionQuery = queryOptions({
  queryFn: getSession,
  queryKey: queryKeys.session,
  staleTime: Number.POSITIVE_INFINITY,
})
