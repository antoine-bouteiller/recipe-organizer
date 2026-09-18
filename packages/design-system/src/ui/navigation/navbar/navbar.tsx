import { Link, type LinkOptions } from '@tanstack/react-router'
import type React from 'react'

import * as styles from './navbar.css'

export interface NavbarProps {
  actions?: React.ReactNode
  items: readonly { label: string; linkProps: LinkOptions }[]
}

export const Navbar = ({ actions, items }: NavbarProps): React.ReactElement => (
  <div className={styles.container} data-slot="navbar">
    <nav className={styles.element} data-slot="navbar-items">
      {items.map((item) => (
        <Link
          {...item.linkProps}
          activeOptions={item.linkProps.activeOptions ?? (item.linkProps.to === '/' ? { exact: true } : undefined)}
          className={styles.navbarItem}
          data-slot="navbar-item"
          key={item.linkProps.to}
        >
          {item.label}
        </Link>
      ))}
    </nav>
    <div className={styles.actions} data-slot="navbar-actions">
      {actions}
    </div>
  </div>
)
