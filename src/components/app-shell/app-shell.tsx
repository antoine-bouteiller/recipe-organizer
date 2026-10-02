import { Link } from '@void/react'
import type { ReactNode } from 'react'

import { desktopMenuItems } from '@/components/navigation/constants'
import { isCurrentPath } from '@/design-system/ui/navigation/tabbar/tabbar'

import * as styles from './app-shell.css'

export const AppHeader = ({ children, currentPath }: { children?: ReactNode; currentPath: string }) => (
  <header className={styles.element}>
    <div className={styles.navbar} data-slot="navbar">
      <nav className={styles.navigation} data-slot="navbar-items">
        {desktopMenuItems.map((item) => (
          <Link
            aria-current={isCurrentPath(currentPath, item.href) ? 'page' : undefined}
            className={styles.navbarItem}
            data-slot="navbar-item"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.actions} data-slot="navbar-actions">
        {children}
      </div>
    </div>
  </header>
)

export const AppMain = ({ children }: { children: ReactNode }) => <main className={styles.mainContent}>{children}</main>
