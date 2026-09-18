import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { useSwipeTabs } from '@design-system/hooks/use-swipe-tabs'
import React, { createContext, useContext } from 'react'

import * as styles from './tabs.css'

export type TabsListProps = Pick<TabsPrimitive.List.Props, 'aria-label' | 'children'> & { width?: 'fit' | 'full' }
export const TabsList = ({ 'aria-label': ariaLabel, children, width = 'fit' }: TabsListProps): React.ReactElement => (
  <TabsPrimitive.List aria-label={ariaLabel} className={styles.list({ width })} data-slot="tabs-list">
    <>
      {children}
      <TabsPrimitive.Indicator className={styles.indicator()} data-slot="tab-indicator" />
    </>
  </TabsPrimitive.List>
)

export type TabsTabProps = Pick<TabsPrimitive.Tab.Props, 'children' | 'value'>
export const TabsTab = ({ children, value }: TabsTabProps): React.ReactElement => (
  <TabsPrimitive.Tab className={styles.tab()} data-slot="tabs-tab" value={value}>
    {children}
  </TabsPrimitive.Tab>
)

type SwipeTabsContextValue = Pick<
  ReturnType<typeof useSwipeTabs>,
  'activeIndex' | 'activeTab' | 'containerRef' | 'onTouchEnd' | 'onTouchMove' | 'onTouchStart' | 'trackRef'
>
const SwipeTabsContext = createContext<SwipeTabsContextValue | null>(null)

export type SwipeTabsProps<TTab extends string> = Pick<TabsPrimitive.Root.Props, 'children'> & {
  defaultTab: TTab
  tabs: readonly TTab[]
}
export const SwipeTabs = <TTab extends string>({ children, defaultTab, tabs }: SwipeTabsProps<TTab>): React.ReactElement => {
  const { activeIndex, activeTab, containerRef, trackRef, goTo, onTouchStart, onTouchMove, onTouchEnd } = useSwipeTabs(tabs, defaultTab)
  return (
    <SwipeTabsContext.Provider value={{ activeIndex, activeTab, containerRef, onTouchEnd, onTouchMove, onTouchStart, trackRef }}>
      <TabsPrimitive.Root
        className={styles.root()}
        data-slot="tabs"
        onValueChange={(value) => {
          const nextTab = tabs.find((tab) => tab === value)
          if (nextTab) {
            goTo(nextTab)
          }
        }}
        value={activeTab}
      >
        {children}
      </TabsPrimitive.Root>
    </SwipeTabsContext.Provider>
  )
}

export type SwipeTabsPanelsProps = Pick<React.ComponentProps<'div'>, 'children'>
export const SwipeTabsPanels = ({ children }: SwipeTabsPanelsProps): React.ReactElement => {
  const context = useContext(SwipeTabsContext)
  if (!context) {
    throw new Error('SwipeTabsPanels must be rendered inside SwipeTabs')
  }
  const { containerRef, trackRef, onTouchEnd, onTouchMove, onTouchStart } = context
  return (
    <div className={styles.panels()} data-slot="swipe-tabs-panels" ref={containerRef}>
      <div className={styles.track()} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} ref={trackRef}>
        {children}
      </div>
    </div>
  )
}

export type SwipeTabsPanelProps = Pick<React.ComponentProps<'div'>, 'children'> & { value: string }
export const SwipeTabsPanel = ({ children, value }: SwipeTabsPanelProps): React.ReactElement => {
  const context = useContext(SwipeTabsContext)
  if (!context) {
    throw new Error('SwipeTabsPanel must be rendered inside SwipeTabs')
  }
  const inactive = context.activeTab !== value
  return (
    <div className={styles.panel()} data-slot="swipe-tabs-panel" inert={inactive} role="tabpanel">
      {children}
    </div>
  )
}
