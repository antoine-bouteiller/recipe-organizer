import { desktopMenuItems } from '@client/components/navigation/constants'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import * as styles from './app-shell.css'

export const AppHeader = ({ children }: { children?: ReactNode }) => (
  <header className={styles.element}>
    <div className={styles.navbar} data-slot="navbar">
      <nav className={styles.navigation} data-slot="navbar-items">
        {desktopMenuItems.map((item) => (
          <Link
            {...item.linkProps}
            activeOptions={item.linkProps.to === '/' ? { exact: true } : undefined}
            className={styles.navbarItem}
            data-slot="navbar-item"
            key={item.linkProps.to}
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

export const NavbarSearchPlaceholder = () => <div className={styles.container} />
