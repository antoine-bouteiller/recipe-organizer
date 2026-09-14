import { type QueryClient } from '@tanstack/react-query'

import { getRecipeListOptions } from './get-all'
import { getRecipeDetailsOptions } from './get-one'

interface PublicRouteMatch {
  routeId: string
  params: { id?: string }
}

type QueryPrefetcher = Pick<QueryClient, 'query'>

export const prefetchPublicRecipeRoute = (queryClient: QueryPrefetcher, matches: readonly PublicRouteMatch[]) => {
  const match = matches.find((candidate) => candidate.routeId !== '__root__')

  if (match?.routeId === '/' || match?.routeId === '/search') {
    return queryClient.query({ ...getRecipeListOptions(), staleTime: 'static' }).catch(() => undefined)
  }

  if (match?.routeId === '/recipe/$id') {
    const id = Number.parseInt(match.params.id ?? '', 10)
    if (!Number.isNaN(id)) {
      return queryClient.query({ ...getRecipeDetailsOptions(id), staleTime: 'static' }).catch(() => undefined)
    }
  }

  return Promise.resolve()
}
