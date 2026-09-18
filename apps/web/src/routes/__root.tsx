import { desktopMenuItems } from '@client/components/navigation/constants'
import { useToggleTheme } from '@client/hooks/use-toggle-theme'
import { loadAuthUser, type getAuthUser } from '@client/lib/auth/get-auth-user'
import { getTheme } from '@client/lib/theme'
import { Button } from '@recipe-organizer/design-system/button'
import { ThemeIcon } from '@recipe-organizer/design-system/icons/theme'
import { Navbar } from '@recipe-organizer/design-system/navbar'
import { ToastProvider } from '@recipe-organizer/design-system/toast'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { lazy, Suspense, useLayoutEffect } from 'react'

import * as styles from './root.css'

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
      <header className={styles.element}>
        <Navbar
          items={desktopMenuItems}
          actions={
            <>
              <Suspense fallback={<div className={styles.container} />}>
                <SearchBar />
              </Suspense>
              <Button aria-label="Changer de thème" onClick={toggleTheme} size="icon" variant="ghost">
                <ThemeIcon size="lg" />
              </Button>
            </>
          }
        />
      </header>
      <main className={styles.element2}>
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
  beforeLoad: async () => {
    const authUser = await loadAuthUser()
    const theme = getTheme()

    return { authUser, isAdmin: authUser?.role === 'admin', theme }
  },
  component: RootComponent,
})
