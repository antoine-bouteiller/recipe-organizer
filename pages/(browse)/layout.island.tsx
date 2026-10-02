import '@recipe-organizer/design-system/global.css'
import '@recipe-organizer/design-system/styles.css'
import { AppHeader, AppMain } from '@client/components/app-shell/app-shell'
import { useShared } from '@void/react'
import type { ReactNode } from 'react'

// Keep in sync with the AppHeader breakpoint in app-shell.css.ts.
import SearchBar from './_search-bar' with { island: 'media:(min-width: 768px)' }
import ThemeToggle from './_theme-toggle' with { island: 'media:(min-width: 768px)' }

export default function BrowseLayout({ children }: { children: ReactNode }) {
  const { pathname } = useShared()

  return (
    <>
      <AppHeader currentPath={pathname}>
        <SearchBar />
        <ThemeToggle />
      </AppHeader>
      <AppMain>{children}</AppMain>
    </>
  )
}
