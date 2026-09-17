import { Navbar } from '@client/components/navigation/navbar'
import { loadAuthUser, type getAuthUser } from '@client/lib/auth/get-auth-user'
import { getTheme } from '@client/lib/theme'
import { ToastProvider } from '@recipe-organizer/design-system/toast'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { lazy, Suspense, useLayoutEffect } from 'react'

import * as styles from './-root.css'

const SearchBar = lazy(() => import('@client/features/recipe/components/search-bar'))

type AuthUser = Awaited<ReturnType<typeof getAuthUser>>
type Theme = ReturnType<typeof getTheme>

const RootComponent = () => {
  const { theme } = Route.useRouteContext()

  useLayoutEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  return (
    <ToastProvider>
      <header className={styles.element}>
        <Navbar
          search={
            <Suspense fallback={<div className={styles.container} />}>
              <SearchBar />
            </Suspense>
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
