import { AppHeader, AppMain, NavbarSearchPlaceholder } from '@client/components/app-shell/app-shell'
import { useToggleTheme } from '@client/hooks/use-toggle-theme'
import { loadAuthUser } from '@client/lib/auth/get-auth-user'
import type { getAuthUser } from '@client/lib/auth/get-auth-user'
import { getTheme } from '@client/lib/theme'
import { Button } from '@recipe-organizer/design-system/button'
import { ThemeIcon } from '@recipe-organizer/design-system/icons/theme'
import { ToastProvider } from '@recipe-organizer/design-system/toast'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { lazy, Suspense, useLayoutEffect } from 'react'

const SearchBar = lazy(() => import('@client/features/recipe/components/search-bar'))

type AuthUser = Awaited<ReturnType<typeof getAuthUser>>
type Theme = ReturnType<typeof getTheme>

const RootComponent = () => {
  const { theme } = Route.useRouteContext()
  const toggleTheme = useToggleTheme()

  useLayoutEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  return (
    <ToastProvider>
      <AppHeader>
        <Suspense fallback={<NavbarSearchPlaceholder />}>
          <SearchBar />
        </Suspense>
        <Button aria-label="Changer de thème" onClick={toggleTheme} size="icon" variant="ghost">
          <ThemeIcon size="lg" />
        </Button>
      </AppHeader>
      <AppMain>
        <Outlet />
      </AppMain>
    </ToastProvider>
  )
}

export const Route = createRootRouteWithContext<{
  authUser: AuthUser
  queryClient: QueryClient
  theme: Theme
}>()({
  beforeLoad: async () => {
    const authUser = await loadAuthUser()
    const theme = getTheme()

    return { authUser, isAdmin: authUser?.role === 'admin', theme }
  },
  component: RootComponent,
})
