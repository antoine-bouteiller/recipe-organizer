import type React from 'react'

import * as styles from './tabs.css'

// HTML + CSS: panels scroll-snap, tabs are hash links, and a clipped copy of the labels follows the scroll timeline as the active pill.
// Once hydrated, a click scrolls the panel itself and replaces the hash, so tab switches add no history entries.
const selectTab = (event: React.MouseEvent<HTMLAnchorElement>, value: string) => {
  event.preventDefault()
  document.getElementById(value)?.scrollIntoView({ block: 'nearest', inline: 'start' })
  history.replaceState(history.state, '', `#${value}`)
}

interface TabsItem {
  content: React.ReactNode
  label: React.ReactNode
  value: string
}

export type TabsProps = Pick<React.ComponentProps<'nav'>, 'aria-label'> & { items: readonly TabsItem[] }

export const Tabs = ({ 'aria-label': ariaLabel, items }: TabsProps): React.ReactElement => (
  <div className={styles.root} data-slot="tabs">
    <nav aria-label={ariaLabel} className={styles.list} data-slot="tabs-list">
      {items.map(({ label, value }) => (
        <a className={styles.tab} data-slot="tabs-tab" href={`#${value}`} key={value} onClick={(event) => selectTab(event, value)}>
          {label}
        </a>
      ))}
      {/* Must stay the last child: indicator geometry derives from sibling-count(). Its label copies must match the tabs' layout. */}
      <span aria-hidden className={styles.indicator} data-slot="tab-indicator">
        <span className={styles.indicatorPill}>
          {items.map(({ label, value }) => (
            <span className={styles.tab} key={value}>
              {label}
            </span>
          ))}
        </span>
      </span>
    </nav>
    <div className={styles.panels} data-slot="tabs-panels">
      {items.map(({ content, value }) => (
        <div className={styles.panel} data-slot="tabs-panel" id={value} key={value}>
          {content}
        </div>
      ))}
    </div>
  </div>
)
