import type { QueryClient } from '@tanstack/react-query'

import { Serwist } from '@serwist/window'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Navbar } from '@/components/navigation/navbar'
import { TabBar } from '@/components/navigation/tabbar'
import { ToastProvider } from '@/components/ui/toast'
import { getAuthUser } from '@/features/auth/api/get-auth-user'
import { getTheme } from '@/lib/theme'
import { initRecipeQuantitiesState, recipeQuantitiesStore } from '@/stores/recipe-quantities.store'
import { initShoppingListState, shoppingListStore } from '@/stores/shopping-list.store'

import appCss from '../styles/app.css?url'

type AuthUser = Awaited<ReturnType<typeof getAuthUser>>
type Theme = ReturnType<typeof getTheme>

const RootComponent = () => {
  const { theme } = Route.useRouteContext()

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        const serwist = new Serwist('/sw.js', { scope: '/', type: 'module' })
        await serwist.register()
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
        {import.meta.env.DEV && <ReactQueryDevtools />}
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

    shoppingListStore.setState(initShoppingListState())
    recipeQuantitiesStore.setState(initRecipeQuantitiesState())

    return { authUser, isAdmin: authUser?.role === 'admin', theme }
  },
  component: RootComponent,
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
  notFoundComponent: () => <div>Not found</div>,
})
