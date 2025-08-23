/// <reference types="vite/client" />
import { Toaster } from '@/components/ui/sonner'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import type { User } from 'better-auth'
import appCss from '../styles/app.css?url'
import { getAuthUser } from '@/features/auth/api/get-auth-user'

const RootComponent = () => (
  <html lang="fr">
    <head>
      <HeadContent />
    </head>
    <body>
      <Toaster />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <Scripts />
    </body>
  </html>
)

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  authUser: User | undefined
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Recipe Organizer',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  beforeLoad: async () => {
    const authUser = await getAuthUser()
    return { authUser }
  },
  component: RootComponent,
  notFoundComponent: () => <div>Not found</div>,
})
