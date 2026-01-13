import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul-base'

import { cn } from '@/utils/cn'

import { ScrollArea } from './scroll-area'

const Drawer = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => <DrawerPrimitive.Root data-slot="drawer" {...props} />

export type DrawerTriggerProps = React.ComponentProps<typeof DrawerPrimitive.Trigger>

const DrawerTrigger = ({ ...props }: DrawerTriggerProps) => <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />

const DrawerPortal = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) => (
  <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
)

const DrawerClose = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) => (
  <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
)

const DrawerOverlay = ({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Overlay>) => (
  <DrawerPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0',
      className
    )}
    data-slot="drawer-backdrop"
    {...props}
  />
)

export type DrawerOverlayProps = React.ComponentProps<typeof DrawerPrimitive.Overlay>

const DrawerPopup = ({ children, className, ...props }: DrawerOverlayProps) => (
  <DrawerPortal data-slot="drawer-portal">
    <DrawerOverlay />
    <DrawerPrimitive.Content
      className={cn(
        `group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-popover-foreground`,
        `data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b`,
        `data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-2xl data-[vaul-drawer-direction=bottom]:border-t`,
        `data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm`,
        `data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm`,
        className
      )}
      data-slot="drawer-content"
      {...props}
    >
      <div className="mx-auto mt-4 hidden h-1 w-25 shrink-0 rounded-full bg-popover-foreground/50 group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
)

const DrawerHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      `flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left`,
      className
    )}
    data-slot="drawer-header"
    {...props}
  />
)

const DrawerPanel = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <ScrollArea>
    <div
      className={cn(
        'px-4 pb-4 in-[[data-slot=drawer-popup]:has([data-slot=drawer-header])]:pt-1 in-[[data-slot=drawer-popup]:not(:has([data-slot=drawer-footer]))]:pb-4! in-[[data-slot=drawer-popup]:not(:has([data-slot=drawer-footer].border-t))]:pb-1 in-[[data-slot=drawer-popup]:not(:has([data-slot=drawer-header]))]:pt-4',
        className
      )}
      data-slot="drawer-panel"
      {...props}
    />
  </ScrollArea>
)

const DrawerFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} data-slot="drawer-footer" {...props} />
)

const DrawerTitle = ({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) => (
  <DrawerPrimitive.Title className={cn('font-semibold text-foreground', className)} data-slot="drawer-title" {...props} />
)

const DrawerDescription = ({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Description>) => (
  <DrawerPrimitive.Description className={cn('text-sm text-muted-foreground', className)} data-slot="drawer-description" {...props} />
)

export {
  Drawer,
  DrawerClose,
  DrawerPopup,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  DrawerPanel,
}
