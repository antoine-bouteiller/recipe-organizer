import OfflineBanner from '@client/components/error/offline-banner'
import { Navbar } from '@client/components/navigation/navbar'
import { ToastProvider } from '@client/components/ui/toast'
import { prefetchPublicRecipeRoute } from '@client/features/recipe/api/prefetch-public-route'
import { loadAuthUser, type getAuthUser } from '@client/lib/auth/get-auth-user'
import { getTheme } from '@client/lib/theme'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'

const SearchBar = lazy(() => import('@client/features/recipe/components/search-bar'))
const loadSerwist = () => import('@serwist/window')

type AuthUser = Awaited<ReturnType<typeof getAuthUser>>
type Theme = ReturnType<typeof getTheme>
const RootComponent = () => {
  const { theme } = Route.useRouteContext()

  useLayoutEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const { Serwist } = await loadSerwist()
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
    <ToastProvider>
      <OfflineBanner />
      <header className="sticky top-0 z-50 hidden w-full bg-muted md:block">
        <Navbar
          search={
            <Suspense fallback={<div className="h-9 w-56" />}>
              <SearchBar />
            </Suspense>
          }
        />
      </header>
      <main className="flex min-h-0 flex-1 flex-col md:pb-0">
        <Outlet />
      </main>
    </ToastProvider>
  )
}

export const Route = createRootRouteWithContext<{
  authUser: AuthUser
  queryClient: QueryClient
  theme: Theme
}>()({
  beforeLoad: async ({ context, matches }) => {
    void prefetchPublicRecipeRoute(context.queryClient, matches)

    const authUser = await loadAuthUser()
    const theme = getTheme()

    return { authUser, isAdmin: authUser?.role === 'admin', theme }
  },
  component: RootComponent,
})
