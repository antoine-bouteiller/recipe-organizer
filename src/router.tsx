// src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClient } from '@tanstack/react-query'
import { NotFound } from '@/components/not-found'
import { DefaultCatchBoundary } from '@/components/default-catch-boundary'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}

export const createRouter = () => {
  const queryClient = new QueryClient()

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      notFoundMode: 'root',
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: NotFound,
      context: {
        queryClient,
        authUser: undefined,
      },
    }),
    queryClient
  )

  return router
}
