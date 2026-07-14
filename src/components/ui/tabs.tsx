import { Tabs as TabsPrimitive } from '@kobalte/core/tabs'
import { type ComponentProps, createContext, type JSX, splitProps, useContext } from 'solid-js'

import { useSwipeTabs } from '@/hooks/use-swipe-tabs'
import { cn } from '@/utils/cn'

export const Tabs = (props: ComponentProps<typeof TabsPrimitive>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <TabsPrimitive class={cn('flex flex-col gap-2 data-[orientation=vertical]:flex-row', local.class)} data-slot="tabs" {...rest} />
}

export const TabsList = (props: ComponentProps<typeof TabsPrimitive.List>) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <TabsPrimitive.List
      class={cn(
        'relative z-0 flex w-fit items-center justify-center gap-x-0.5 rounded-lg bg-white/50 p-0.5 text-muted-foreground/64 data-[orientation=vertical]:flex-col dark:bg-white/4',
        local.class
      )}
      data-slot="tabs-list"
      {...rest}
    >
      {local.children}
      <TabsPrimitive.Indicator
        class="absolute rounded-md bg-background shadow-sm transition-all duration-300 ease-out dark:bg-accent"
        data-slot="tab-indicator"
      />
    </TabsPrimitive.List>
  )
}

export const TabsTab = (props: ComponentProps<typeof TabsPrimitive.Trigger>) => {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <TabsPrimitive.Trigger
      class={cn(
        "relative flex h-9 shrink-0 grow cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-[calc(--spacing(2.5)-1px)] font-medium text-base outline-none transition-[color,background-color,box-shadow] hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring data-disabled:pointer-events-none data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start data-selected:text-foreground data-disabled:opacity-64 sm:h-8 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
        local.class
      )}
      data-slot="tabs-tab"
      {...rest}
    />
  )
}

export const TabsPanel = (props: ComponentProps<typeof TabsPrimitive.Content>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <TabsPrimitive.Content class={cn('flex-1 outline-none', local.class)} data-slot="tabs-content" {...rest} />
}

type SwipeTabsContextValue = Pick<ReturnType<typeof useSwipeTabs>, 'containerRef' | 'onTouchEnd' | 'onTouchMove' | 'onTouchStart' | 'trackRef'>

const SwipeTabsContext = createContext<SwipeTabsContextValue>()

interface SwipeTabsProps<TTab extends string> {
  tabs: readonly TTab[]
  defaultTab: TTab
  class?: string
  children: JSX.Element
}

export const SwipeTabs = <TTab extends string>(props: SwipeTabsProps<TTab>) => {
  const swipe = useSwipeTabs(props.tabs, props.defaultTab)

  return (
    <SwipeTabsContext.Provider value={swipe}>
      <Tabs class={props.class} onChange={(value) => swipe.goTo(value as TTab)} value={swipe.activeTab()}>
        {props.children}
      </Tabs>
    </SwipeTabsContext.Provider>
  )
}

export const SwipeTabsPanels = (props: { class?: string; children: JSX.Element }) => {
  const context = useContext(SwipeTabsContext)
  if (!context) {
    throw new Error('SwipeTabsPanels must be rendered inside SwipeTabs')
  }

  return (
    <div class={cn('min-h-0 flex-1 overflow-hidden', props.class)} data-slot="swipe-tabs-panels" ref={context.containerRef}>
      <div
        class="flex h-full [&>*]:w-full [&>*]:shrink-0"
        onTouchEnd={context.onTouchEnd}
        onTouchMove={context.onTouchMove}
        onTouchStart={context.onTouchStart}
        ref={context.trackRef}
      >
        {props.children}
      </div>
    </div>
  )
}
