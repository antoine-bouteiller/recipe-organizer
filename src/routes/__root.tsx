import { Toaster } from '@/components/ui/sonner'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router'

import { HomeIcon } from '@/components/icons/home'
import { SettingsIcon } from '@/components/icons/settings'
import { Button } from '@/components/ui/button'
import { getAuthUser } from '@/features/auth/api/get-auth-user'
import type { User } from 'better-auth'
import { SearchIcon, ShoppingCartIcon } from 'lucide-react'
import { useEffect } from 'react'
import { getSerwist } from 'virtual:serwist'
import appCss from '../styles/app.css?url'

const loadSerwist = async () => {
  if ('serviceWorker' in navigator) {
    const serwist = await getSerwist()

    void serwist?.register()
  }
}

const RootComponent = () => {
  useEffect(() => {
    void loadSerwist()
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
          <div className="shrink-0 p-2 flex justify-around md:hidden border-t border-border">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link to="/">
                {({ isActive }) => <HomeIcon className="size-6" filled={isActive} />}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link to="/" search={{ search: true }}>
                <SearchIcon className="size-6" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link to="/shopping-list">
                {({ isActive }) => (
                  <ShoppingCartIcon className="size-6" fill={isActive ? 'currentColor' : 'none'} />
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link to="/settings">
                {({ isActive }) => <SettingsIcon className="size-6" filled={isActive} />}
              </Link>
            </Button>
          </div>
        </div>
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
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
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
