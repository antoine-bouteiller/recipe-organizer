import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import React, { Children, cloneElement, createContext, isValidElement, useContext } from 'react'

import { useSwipeTabs } from '@/hooks/use-swipe-tabs'
import { cn } from '@/utils/cn'

export const Tabs = ({ className, ...props }: TabsPrimitive.Root.Props): React.ReactElement => (
  <TabsPrimitive.Root className={cn('flex flex-col gap-2 data-[orientation=vertical]:flex-row', className)} data-slot="tabs" {...props} />
)

export const TabsList = ({ className, children, ...props }: TabsPrimitive.List.Props): React.ReactElement => (
  <TabsPrimitive.List
    className={cn(
      `relative z-0 flex w-fit items-center justify-center gap-x-0.5 rounded-lg bg-muted p-0.5 text-muted-foreground/64 data-[orientation=vertical]:flex-col`,
      className
    )}
    data-slot="tabs-list"
    {...props}
  >
    {children}
    <TabsPrimitive.Indicator
      className="absolute bottom-0 left-0 -z-1 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) rounded-md bg-background shadow-sm transition-[translate,width,height] duration-300 ease-out dark:bg-accent"
      data-slot="tab-indicator"
    />
  </TabsPrimitive.List>
)

export const TabsTab = ({ className, ...props }: TabsPrimitive.Tab.Props): React.ReactElement => (
  <TabsPrimitive.Tab
    className={cn(
      "relative flex h-9 shrink-0 grow cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-[calc(--spacing(2.5)-1px)] font-medium text-base outline-none transition-[color,background-color,box-shadow] hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring data-disabled:pointer-events-none data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start data-active:text-foreground data-disabled:opacity-64 sm:h-8 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
      className
    )}
    data-slot="tabs-tab"
    {...props}
  />
)

export const TabsPanel = ({ className, ...props }: TabsPrimitive.Panel.Props): React.ReactElement => (
  <TabsPrimitive.Panel className={cn('flex-1 outline-none', className)} data-slot="tabs-content" {...props} />
)

type SwipeTabsContextValue = Pick<ReturnType<typeof useSwipeTabs>, 'containerRef' | 'onTouchEnd' | 'onTouchMove' | 'onTouchStart' | 'trackRef'>

const SwipeTabsContext = createContext<SwipeTabsContextValue | null>(null)

interface SwipeTabsProps<TTab extends string> {
  tabs: readonly TTab[]
  defaultTab: TTab
  className?: string
  children: React.ReactNode
}

export const SwipeTabs = <TTab extends string>({ tabs, defaultTab, className, children }: SwipeTabsProps<TTab>): React.ReactElement => {
  const { activeTab, containerRef, trackRef, goTo, onTouchStart, onTouchMove, onTouchEnd } = useSwipeTabs(tabs, defaultTab)

  return (
    <SwipeTabsContext.Provider value={{ containerRef, onTouchEnd, onTouchMove, onTouchStart, trackRef }}>
      <Tabs className={className} onValueChange={(value) => goTo(value as TTab)} value={activeTab}>
        {children}
      </Tabs>
    </SwipeTabsContext.Provider>
  )
}

export const SwipeTabsPanels = ({ className, children }: { className?: string; children: React.ReactNode }): React.ReactElement => {
  const context = useContext(SwipeTabsContext)
  if (!context) {
    throw new Error('SwipeTabsPanels must be rendered inside SwipeTabs')
  }
  const { containerRef, trackRef, onTouchStart, onTouchMove, onTouchEnd } = context

  return (
    <div ref={containerRef} className={cn('min-h-0 flex-1 overflow-hidden', className)} data-slot="swipe-tabs-panels">
      <div className="flex h-full" onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} ref={trackRef}>
        {Children.map(children, (child) =>
          isValidElement<{ className?: string }>(child) ? cloneElement(child, { className: cn('min-w-full shrink-0', child.props.className) }) : child
        )}
      </div>
    </div>
  )
}
