import { Link, type LinkOptions } from '@tanstack/react-router'
import type React from 'react'

import * as styles from './tabbar.css'

export interface TabBarProps {
  items: readonly {
    label: string
    linkProps: LinkOptions
    activeIcon: React.ReactNode
    icon: React.ReactNode
  }[]
}

export const TabBar = ({ items }: TabBarProps): React.ReactElement => (
  <nav className={styles.element} data-slot="tab-bar">
    {items.map((item) => (
      <Link {...item.linkProps} className={styles.tabBarItem} data-slot="tab-bar-item" key={item.linkProps.to}>
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
