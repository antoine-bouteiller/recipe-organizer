import { Serwist } from '@serwist/window'
import { type QueryClient } from '@tanstack/solid-query'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/solid-router'
import { lazy, onMount, Suspense } from 'solid-js'

import OfflineBanner from '@/components/error/offline-banner'
import { Navbar } from '@/components/navigation/navbar'
import { ToastProvider } from '@/components/ui/toast'
import { getAuthUser } from '@/lib/auth/get-auth-user'
import { getTheme } from '@/lib/theme'

import appCss from '../styles/app.css?url'

const SearchBar = lazy(() => import('@/features/recipe/components/search-bar'))

type AuthUser = Awaited<ReturnType<typeof getAuthUser>>
type Theme = ReturnType<typeof getTheme>

const RootComponent = () => {
  const context = Route.useRouteContext()

  onMount(() => {
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
  })

  return (
    <html class={context().theme} lang="fr">
      <head>
        <HeadContent />
      </head>

      <body class="fixed top-0 isolate flex h-dvh! w-screen flex-col overflow-hidden">
        <ToastProvider>
          <OfflineBanner />
          <header class="sticky top-0 z-50 hidden w-full bg-muted md:block">
            <Navbar
              search={
                <Suspense fallback={<div class="h-9 w-56" />}>
                  <SearchBar />
                </Suspense>
              }
            />
          </header>
          <main class="flex min-h-0 flex-1 flex-col md:pb-0">
            <Outlet />
          </main>
        </ToastProvider>
        <Scripts />
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
  head: () => ({
    links: [
      { href: appCss, rel: 'stylesheet' },
      { href: '/manifest.json', rel: 'manifest' },
      { href: '/favicon.ico', rel: 'icon' },
      { href: '/apple-touch-icon.png', rel: 'apple-touch-icon' },
      {
        href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap',
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
        content: 'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content',
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
  shellComponent: RootComponent,
})
