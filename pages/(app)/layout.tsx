import '@/styles/global.css'
import '@/styles/styles.css'
import '@/lib/client/zod-locale'
import { useShared } from '@void/react'
import type { ReactNode } from 'react'

import { AppErrorBoundary } from '@/components/app-error/app-error'
import { AppHeader, AppMain } from '@/components/app-shell/app-shell'
import { ThemeToggle } from '@/components/app-shell/theme-toggle'
import SearchBar from '@/features/recipe/client/components/search-bar'

export default function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useShared()

  return (
    <>
      <AppHeader currentPath={pathname}>
        <SearchBar />
        <ThemeToggle />
      </AppHeader>
      <AppMain>
        <AppErrorBoundary key={pathname}>{children}</AppErrorBoundary>
      </AppMain>
    </>
  )
}
