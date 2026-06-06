import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'motion/react'
import type React from 'react'

import { cn } from '@/utils/cn'

export const Tabs = ({ className, ...props }: TabsPrimitive.Root.Props): React.ReactElement => (
  <TabsPrimitive.Root className={cn('flex flex-col gap-2 data-[orientation=vertical]:flex-row', className)} data-slot="tabs" {...props} />
)

const tabListVariants = cva(
  `
    relative z-0 flex w-fit items-center justify-center gap-x-0.5
    text-muted-foreground data-[orientation=vertical]:flex-col
  `,
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'rounded-lg bg-muted p-0.5 text-muted-foreground/64',
        tabbar: 'flex w-full flex-1 items-center justify-around',
        underline: `
          data-[orientation=horizontal]:py-1
          data-[orientation=vertical]:px-1
          *:data-[slot=tabs-trigger]:hover:bg-accent
        `,
      },
    },
  }
)

const tabIndicatorVariants = cva(
  `
  absolute bottom-0 left-0 h-(--active-tab-height)
  w-(--active-tab-width) translate-x-(--active-tab-left)
  -translate-y-(--active-tab-bottom)
`,
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: `
          -z-1 rounded-md bg-background shadow-sm
          dark:bg-accent
        `,
        tabbar: `
          -z-1 rounded-full bg-accent
        `,
        underline: `
          z-10 bg-primary
          data-[orientation=horizontal]:h-0.5
          data-[orientation=horizontal]:translate-y-px
          data-[orientation=vertical]:w-0.5
          data-[orientation=vertical]:-translate-x-px
        `,
      },
    },
  }
)

export const TabsList = ({
  variant = 'default',
  className,
  children,
  indicatorLayoutId,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabListVariants> & { indicatorLayoutId?: string }): React.ReactElement => (
  <TabsPrimitive.List className={cn(tabListVariants({ variant }), className)} data-slot="tabs-list" {...props}>
    {children}
    <TabsPrimitive.Indicator
      data-slot="tab-indicator"
      render={<motion.span layoutId={indicatorLayoutId} layout transition={{ bounce: 0.15, duration: 0.3, type: 'spring' }} />}
      className={cn(tabIndicatorVariants({ variant }))}
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

export { TabsPrimitive }
