import { Toaster } from '@/components/ui/sonner'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'

import { Navbar } from '@/components/navbar'
import { TabBar } from '@/components/tabbar'
import { getAuthUser } from '@/features/auth/api/get-auth-user'
import { getTheme } from '@/features/theme/api/theme'
import { ThemeProvider } from '@/features/theme/theme-provider'
import type { User } from 'better-auth'
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

  const theme = Route.useLoaderData()

  return (
    <html lang="fr" className={theme}>
      <head>
        <HeadContent />
      </head>
      <ThemeProvider theme={theme}>
        <body className="flex flex-col min-h-dvh">
          <header className="bg-background sticky top-0 z-50 w-full hidden md:block">
            <Navbar />
          </header>
          <div className="flex-1">
            <Outlet />
          </div>
          <div className="w-full md:hidden sticky bottom-0">
            <TabBar />
          </div>
        </body>
      </ThemeProvider>
      <Toaster />
      <Scripts />
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
          'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content',
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
