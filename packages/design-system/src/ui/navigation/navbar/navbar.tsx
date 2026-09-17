import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type React from 'react'

import * as styles from './navbar.css'

export interface NavbarProps {
  actions?: React.ReactNode
  children: React.ReactNode
}

export const Navbar = ({ actions, children }: NavbarProps): React.ReactElement => (
  <div className={styles.container} data-slot="navbar">
    <nav className={styles.element} data-slot="navbar-items">
      {children}
    </nav>
    <div className={styles.container2} data-slot="navbar-actions">
      {actions}
    </div>
  </div>
)

export type NavbarItemProps = Pick<useRender.ComponentProps<'a'>, 'aria-current' | 'children' | 'href' | 'render'>

export const NavbarItem = ({ render, ...props }: NavbarItemProps): React.ReactElement => {
  const mergedProps = mergeProps<'a'>({ className: styles.navbarItem }, props)

  return useRender({ defaultTagName: 'a', props: { ...mergedProps, 'data-slot': 'navbar-item' }, render })
}
