import '@recipe-organizer/design-system/global.css'
import '@recipe-organizer/design-system/styles.css'
import '@client/lib/zod-locale'
import { AppErrorBoundary } from '@client/components/app-error/app-error'
import { AppHeader, AppMain } from '@client/components/app-shell/app-shell'
import { ThemeToggle } from '@client/components/app-shell/theme-toggle'
import SearchBar from '@client/features/recipe/components/search-bar'
import { useShared } from '@void/react'
import type { ReactNode } from 'react'

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
