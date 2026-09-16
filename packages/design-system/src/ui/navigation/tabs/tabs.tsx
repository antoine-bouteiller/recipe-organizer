import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cva } from '@recipe-organizer/design-system/css'
import React, { createContext, useContext } from 'react'

import { useSwipeTabs } from '../../../hooks/use-swipe-tabs'

const listRecipe = cva({
  base: {
    '&[data-orientation=vertical]': { flexDirection: 'column' },
    alignItems: 'center',
    backgroundColor: { _dark: 'white/4', base: 'white/50' },
    borderRadius: 'lg',
    color: 'muted-foreground/64',
    display: 'flex',
    gap: '0.5',
    justifyContent: 'center',
    padding: '0.5',
    position: 'relative',
    width: 'fit-content',
    zIndex: 0,
  },
  defaultVariants: { width: 'fit' },
  variants: { width: { fit: {}, full: { width: 'full' } } },
})
const indicatorRecipe = cva({
  base: {
    backgroundColor: { _dark: 'accent', base: 'background' },
    borderRadius: 'md',
    bottom: '0',
    boxShadow: 'sm',
    height: 'var(--active-tab-height)',
    left: '0',
    position: 'absolute',
    transform: 'translateX(var(--active-tab-left)) translateY(calc(-1 * var(--active-tab-bottom)))',
    transitionDuration: '300ms',
    transitionProperty: 'transform, width, height',
    transitionTimingFunction: 'token(easings.out)',
    width: 'var(--active-tab-width)',
    zIndex: -1,
  },
})
const tabRecipe = cva({
  base: {
    '& svg': { flexShrink: '0', pointerEvents: 'none' },
    '&[data-active]': { color: 'foreground' },
    '&[data-disabled]': { opacity: 0.64, pointerEvents: 'none' },
    '&[data-orientation=vertical]': { justifyContent: 'flex-start', width: 'full' },
    '--owner-icon-margin-inline': '-0.125rem',
    '--owner-icon-size': { base: '1.125rem', sm: '1rem' },
    _focusVisible: { outline: '2px solid token(colors.ring)', outlineOffset: '1px' },
    _hover: { '&:not([data-active])': { color: 'muted-foreground' } },
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 'md',
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'flex',
    flexGrow: '1',
    flexShrink: '0',
    fontSize: { base: 'base', sm: 'sm' },
    fontWeight: 'medium',
    gap: '1.5',
    height: { base: '9', sm: '8' },
    justifyContent: 'center',
    paddingInline: 'calc(0.625rem - 1px)',
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'color, background-color, box-shadow',
    transitionTimingFunction: 'in-out',
    whiteSpace: 'nowrap',
  },
})
const rootRecipe = cva({
  base: { '&[data-orientation=vertical]': { flexDirection: 'row' }, display: 'flex', flex: '1', flexDirection: 'column', gap: '2', minHeight: '0' },
})
const panelsRecipe = cva({ base: { flex: '1', minHeight: '0', overflow: 'hidden' } })
const trackRecipe = cva({ base: { display: 'flex', height: 'full' } })
const panelRecipe = cva({ base: { flexShrink: '0', minWidth: 'full', width: 'full' } })

export type TabsListProps = Pick<TabsPrimitive.List.Props, 'aria-label' | 'children'> & { width?: 'fit' | 'full' }
export const TabsList = ({ 'aria-label': ariaLabel, children, width = 'fit' }: TabsListProps): React.ReactElement => (
  <TabsPrimitive.List aria-label={ariaLabel} className={listRecipe({ width })} data-slot="tabs-list">
    <>
      {children}
      <TabsPrimitive.Indicator className={indicatorRecipe()} data-slot="tab-indicator" />
    </>
  </TabsPrimitive.List>
)

export type TabsTabProps = Pick<TabsPrimitive.Tab.Props, 'children' | 'value'>
export const TabsTab = ({ children, value }: TabsTabProps): React.ReactElement => (
  <TabsPrimitive.Tab className={tabRecipe()} data-slot="tabs-tab" value={value}>
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
        className={rootRecipe()}
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
    <div className={panelsRecipe()} data-slot="swipe-tabs-panels" ref={containerRef}>
      <div className={trackRecipe()} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} ref={trackRef}>
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
    <div className={panelRecipe()} data-slot="swipe-tabs-panel" inert={inactive} role="tabpanel">
      {children}
    </div>
  )
}
