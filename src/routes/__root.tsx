import { Toaster } from '@/components/ui/sonner'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router'

import { menuItems, Navbar } from '@/components/navbar'
import { ThemeProvider } from '@/features/theme/theme-provider'
import { Button } from '@/components/ui/button'
import { getAuthUser } from '@/features/auth/api/get-auth-user'
import type { User } from 'better-auth'
import { useEffect } from 'react'
import { getSerwist } from 'virtual:serwist'
import appCss from '../styles/app.css?url'
import { getTheme } from '@/features/theme/api/theme'
import { cn } from '@/lib/utils'

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

  const theme = Route.useLoaderData()

  return (
    <html lang="fr" className={theme}>
      <head>
        <HeadContent />
      </head>
      <ThemeProvider theme={theme}>
        <body className="h-vh">
          <Toaster />
          <div className="flex flex-col h-dvh max-h-screen overflow-hidden">
            <header className="bg-background sticky top-0 z-50 w-full hidden md:block">
              <Navbar />
            </header>
            <div className="flex-1 overflow-y-auto">
              <Outlet />
            </div>
            <div className="shrink-0 flex justify-around md:hidden h-(--tabbar-height) items-center">
              {menuItems
                .filter((item) => item.display !== 'desktop')
                .map((item) => (
                  <Button
                    variant="ghost"
                    className="rounded-full text-primary hover:text-primary"
                    asChild
                    key={item.label}
                  >
                    <Link to={item.linkProps.to} activeProps={{ className: 'bg-accent' }}>
                      {({ isActive }) => (
                        <item.icon
                          className={cn('size-6')}
                          {...(isActive ? item.iconFilledProps : {})}
                        />
                      )}
                    </Link>
                  </Button>
                ))}
            </div>
          </div>
          <Scripts />
        </body>
      </ThemeProvider>
    </html>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  authUser: User | undefined
}>()({
  head: ({ loaderData }) => ({
    meta: [
      {
        charSet: 'utf8',
      },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, interactive-widget=resizes-content, maximum-scale=1.0, user-scalable=no',
      },
      {
        title: 'Recipe Organizer',
      },
      {
        name: 'theme-color',
        content: loaderData === 'dark' ? '#0d0a0e' : '#fdf6fb',
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
  loader: () => getTheme(),
  component: RootComponent,
  notFoundComponent: () => <div>Not found</div>,
})
