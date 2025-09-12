// src/router.tsx
import { DefaultErrorComponent } from '@/components/default-error-component'
import { NotFound } from '@/components/not-found'
import { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { routeTree } from './routeTree.gen'

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
      defaultErrorComponent: DefaultErrorComponent,
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
