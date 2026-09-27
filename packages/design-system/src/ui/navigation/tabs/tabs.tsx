import { Link } from '@tanstack/react-router'
import type React from 'react'

import * as styles from './tabs.css'

// Pure HTML + CSS: panels scroll-snap, tabs are hash links that replace history, and the indicator and active label follow the scroll timeline.

export type TabsListProps = Pick<React.ComponentProps<'nav'>, 'aria-label' | 'children'>
export const TabsList = ({ 'aria-label': ariaLabel, children }: TabsListProps): React.ReactElement => (
  <nav aria-label={ariaLabel} className={styles.list()} data-slot="tabs-list">
    {children}
    {/* Must stay the last child: tab and indicator geometry derive from sibling-index() and sibling-count(). */}
    <span aria-hidden className={styles.indicator()} data-slot="tab-indicator" />
  </nav>
)

export type TabsTabProps = Pick<React.ComponentProps<'a'>, 'children'> & { value: string }
export const TabsTab = ({ children, value }: TabsTabProps): React.ReactElement => (
  <Link className={styles.tab()} data-slot="tabs-tab" hash={value} replace resetScroll={false} to=".">
    {children}
  </Link>
)

export type SwipeTabsProps = Pick<React.ComponentProps<'div'>, 'children'>
export const SwipeTabs = ({ children }: SwipeTabsProps): React.ReactElement => (
  <div className={styles.root()} data-slot="tabs">
    {children}
  </div>
)

export type SwipeTabsPanelsProps = Pick<React.ComponentProps<'div'>, 'children'>
export const SwipeTabsPanels = ({ children }: SwipeTabsPanelsProps): React.ReactElement => (
  <div className={styles.panels()} data-slot="swipe-tabs-panels">
    {children}
  </div>
)

export type SwipeTabsPanelProps = Pick<React.ComponentProps<'div'>, 'children'> & { value: string }
export const SwipeTabsPanel = ({ children, value }: SwipeTabsPanelProps): React.ReactElement => (
  <div className={styles.panel()} data-slot="swipe-tabs-panel" id={value}>
    {children}
  </div>
)
