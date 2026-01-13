import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'

const Tabs = ({ className, ...props }: TabsPrimitive.Root.Props) => (
  <TabsPrimitive.Root className={cn(`flex flex-col gap-2 data-[orientation=vertical]:flex-row`, className)} data-slot="tabs" {...props} />
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
  -translate-y-(--active-tab-bottom) transition-[width,translate]
  duration-200 ease-in-out
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

const TabsList = ({ children, className, variant = 'default', ...props }: TabsPrimitive.List.Props & VariantProps<typeof tabListVariants>) => (
  <TabsPrimitive.List className={cn(tabListVariants({ variant }), className)} data-slot="tabs-list" {...props}>
    {children}
    <TabsPrimitive.Indicator className={cn(tabIndicatorVariants({ variant }))} data-slot="tab-indicator" />
  </TabsPrimitive.List>
)

const TabsTab = ({ className, ...props }: TabsPrimitive.Tab.Props) => (
  <TabsPrimitive.Tab
    className={cn(
      `flex flex-1 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-ring data-disabled:pointer-events-none data-disabled:opacity-64 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
      `hover:text-muted-foreground aria-selected:text-foreground`,
      'gap-1.5 px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1.5)-1px)]',
      `data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start`,
      className
    )}
    data-slot="tabs-trigger"
    {...props}
  />
)

const TabsPanel = ({ className, ...props }: TabsPrimitive.Panel.Props) => (
  <TabsPrimitive.Panel className={cn('flex-1 outline-none', className)} data-slot="tabs-content" {...props} />
)

export { Tabs, TabsList, TabsPanel, TabsTab }
