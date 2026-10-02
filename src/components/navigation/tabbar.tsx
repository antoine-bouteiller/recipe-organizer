import { Link } from '@void/react'
import type React from 'react'

import * as styles from './tabbar.css'

export interface TabBarProps {
  currentPath: string
  items: readonly {
    label: string
    href: string
    activeIcon: React.ReactNode
    icon: React.ReactNode
  }[]
}

/** Home only matches exactly; other items stay current on their nested pages. */
export const isCurrentPath = (currentPath: string, href: string): boolean =>
  href === '/' ? currentPath === '/' : currentPath === href || currentPath.startsWith(`${href}/`)

export const TabBar = ({ currentPath, items }: TabBarProps): React.ReactElement => (
  <nav className={styles.element} data-slot="tab-bar">
    {items.map((item) => (
      <Link
        aria-current={isCurrentPath(currentPath, item.href) ? 'page' : undefined}
        className={styles.tabBarItem}
        data-slot="tab-bar-item"
        href={item.href}
        key={item.href}
      >
        <span aria-hidden="true" className={styles.iconSlot} data-slot="tab-bar-item-icon-inactive">
          {item.icon}
        </span>
        <span aria-hidden="true" className={styles.activeIconSlot} data-slot="tab-bar-item-icon-active">
          {item.activeIcon}
        </span>
        {item.label}
      </Link>
    ))}
  </nav>
)
