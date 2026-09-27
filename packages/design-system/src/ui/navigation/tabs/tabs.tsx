import { Link } from '@tanstack/react-router'
import type React from 'react'

import * as styles from './tabs.css'

// Pure HTML + CSS: panels scroll-snap, tabs are hash links that replace history, and the indicator and active label follow the scroll timeline.

interface TabsItem {
  content: React.ReactNode
  label: React.ReactNode
  value: string
}

export type TabsProps = Pick<React.ComponentProps<'nav'>, 'aria-label'> & { items: readonly TabsItem[] }

export const Tabs = ({ 'aria-label': ariaLabel, items }: TabsProps): React.ReactElement => (
  <div className={styles.root()} data-slot="tabs">
    <nav aria-label={ariaLabel} className={styles.list()} data-slot="tabs-list">
      {items.map(({ label, value }) => (
        <Link className={styles.tab()} data-slot="tabs-tab" hash={value} key={value} replace resetScroll={false} to=".">
          {label}
        </Link>
      ))}
      {/* Must stay the last child: tab and indicator geometry derive from sibling-index() and sibling-count(). */}
      <span aria-hidden className={styles.indicator()} data-slot="tab-indicator" />
    </nav>
    <div className={styles.panels()} data-slot="tabs-panels">
      {items.map(({ content, value }) => (
        <div className={styles.panel()} data-slot="tabs-panel" id={value} key={value}>
          {content}
        </div>
      ))}
    </div>
  </div>
)
