import { type Decorator } from '@storybook/react-vite'
import { RouterProvider, createMemoryHistory, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

export const withRouter: Decorator = (Story, context) => {
  const parameters: { initialEntries?: string[] } | undefined = context.parameters.router
  const rootRoute = createRootRoute({ component: () => <Story /> })
  const routes = ['/', '$'].map((path) => createRoute({ getParentRoute: () => rootRoute, path }))
  const router = createRouter({
    history: createMemoryHistory({
      initialEntries: parameters?.initialEntries ?? ['/'],
    }),
    routeTree: rootRoute.addChildren(routes),
  })

  return <RouterProvider router={router} />
}
