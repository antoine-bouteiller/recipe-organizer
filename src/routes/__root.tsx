import type { QueryClient } from '@tanstack/react-query'

import { Serwist } from '@serwist/window'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'

import OfflineBanner from '@/components/error/offline-banner'
import { Navbar } from '@/components/navigation/navbar'
import { NavigationProgressBar } from '@/components/navigation/navigation-progress-bar'
import { TabBar } from '@/components/navigation/tabbar'
import { ToastProvider } from '@/components/ui/toast'
import { getAuthUser } from '@/features/auth/api/get-auth-user'
import { getTheme } from '@/lib/theme'

import appCss from '../styles/app.css?url'

type AuthUser = Awaited<ReturnType<typeof getAuthUser>>
type Theme = ReturnType<typeof getTheme>

const RootComponent = () => {
  const { theme } = Route.useRouteContext()

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const serwist = new Serwist('/sw.js', { scope: '/', type: 'module' })
          await serwist.register()
        } catch {
          // App still works without SW - silent failure is OK
          // Service worker provides offline support, not critical functionality
        }
      }
    }

    void registerServiceWorker()
  }, [])

  return (
    <html className={theme} lang="fr">
      <head>
        <HeadContent />
      </head>

      <body className="fixed top-0 flex h-dvh! w-screen flex-col overflow-hidden">
        <ToastProvider>
          <NavigationProgressBar />
          <OfflineBanner />
          <header className="sticky top-0 z-50 hidden w-full bg-background md:block">
            <Navbar />
          </header>
          <main className="flex min-h-0 flex-1 flex-col pb-14 md:pb-0">
            <Outlet />
          </main>
          <div className="fixed bottom-0 z-10 w-full md:hidden">
            <TabBar />
          </div>
        </ToastProvider>
        <Scripts />
        {import.meta.env.DEV && (
          <TanStackDevtools
            plugins={[
              {
                name: 'TanStack Query',
                render: <ReactQueryDevtoolsPanel />,
                defaultOpen: true,
              },
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel />,
                defaultOpen: false,
              },
            ]}
          />
        )}
      </body>
    </html>
  )
}

export const Route = createRootRouteWithContext<{
  authUser: AuthUser
  queryClient: QueryClient
  theme: Theme
}>()({
  beforeLoad: async () => {
    const authUser = await getAuthUser()
    const theme = getTheme()

    return { authUser, isAdmin: authUser?.role === 'admin', theme }
  },
  shellComponent: RootComponent,
  ssr: false,
  head: () => ({
    links: [
      { href: appCss, rel: 'stylesheet' },
      { href: '/manifest.json', rel: 'manifest' },
      { href: '/favicon.ico', rel: 'icon' },
      { href: '/apple-touch-icon.png', rel: 'apple-touch-icon' },
      {
        href: 'https://fonts.googleapis.com/css2?family=Cal+Sans&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
        rel: 'stylesheet',
      },
      {
        href: 'https://fonts.googleapis.com',
        rel: 'preconnect',
      },
      {
        crossOrigin: 'anonymous',
        href: 'https://fonts.gstatic.com',
        rel: 'preconnect',
      },
    ],
    meta: [
      {
        charSet: 'utf8',
      },
      {
        content: 'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover',
        name: 'viewport',
      },
      {
        title: 'Recipe Organizer',
      },
      {
        content: '#2f0d68',
        name: 'theme-color',
      },
    ],
  }),
})
