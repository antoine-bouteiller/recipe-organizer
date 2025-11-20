import { Toaster } from '@/components/ui/sonner'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'

import { Navbar } from '@/components/navigation/navbar'
import { TabBar } from '@/components/navigation/tabbar'
import { getAuthUser } from '@/features/auth/api/get-auth-user'
import { getTheme } from '@/lib/theme'
import { initShoppingListState, shoppingListStore } from '@/stores/shopping-list.store'
import { useEffect } from 'react'
import appCss from '../styles/app.css?url'

type AuthUser = Awaited<ReturnType<typeof getAuthUser>>
type Theme = ReturnType<typeof getTheme>

const RootComponent = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      const swUrl = new URL(`/sw.js`, globalThis.location.href).toString()

      void navigator.serviceWorker.register(swUrl, {
        scope: import.meta.env.BASE_URL,
      })
    }
  }, [])

  const { theme } = Route.useRouteContext()

  return (
    <html lang="fr" className={theme}>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col h-dvh overflow-hidden">
        <header className="bg-background sticky top-0 z-50 w-full hidden md:block">
          <Navbar />
        </header>
        <div className="flex-1 flex flex-col pb-14 md:pb-0 min-h-0">
          <Outlet />
        </div>
        <div className="w-full md:hidden fixed bottom-0 z-10">
          <TabBar />
        </div>
        <Toaster />
      </body>
      <Scripts />
    </html>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  authUser: AuthUser
  theme: Theme
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
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  beforeLoad: async () => {
    const authUser = await getAuthUser()
    const theme = getTheme()

    shoppingListStore.setState(initShoppingListState())

    return { authUser, theme, isAdmin: authUser?.role === 'admin' }
  },
  component: RootComponent,
  notFoundComponent: () => <div>Not found</div>,
})
