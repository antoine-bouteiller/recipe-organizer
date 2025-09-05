/// <reference types="vite/client" />
import { Toaster } from '@/components/ui/sonner'
import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { getAuthUser } from '@/features/auth/api/get-auth-user'
import type { User } from 'better-auth'
import { HomeIcon, SearchIcon, SettingsIcon, ShoppingCartIcon } from 'lucide-react'
import { useEffect } from 'react'
import appCss from '../styles/app.css?url'

const RootComponent = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      const swUrl = new URL(`/sw.js`, globalThis.location.href).toString()

      void navigator.serviceWorker.register(swUrl, { scope: import.meta.env.BASE_URL })
    }
  }, [])

  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body className="h-dvh">
        <Toaster />
        <div className="flex flex-col h-dvh max-h-screen overflow-hidden">
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <Outlet />
          </div>
          <div className="shrink-0 p-2 flex justify-around md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link to="/">
                <HomeIcon className="size-6" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link to="/" search={{ search: true }}>
                <SearchIcon className="size-6" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link to="/cart">
                <ShoppingCartIcon className="size-6" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link to="/settings">
                <SettingsIcon className="size-6" />
              </Link>
            </Button>
          </div>
        </div>
        {/* <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" /> */}
        <Scripts />
      </body>
    </html>
  )
}

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
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
  }),
  beforeLoad: async () => {
    const authUser = await getAuthUser()
    return { authUser }
  },
  component: RootComponent,
  notFoundComponent: () => <div>Not found</div>,
})
