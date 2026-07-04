import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/utils/cn'

export const Drawer = (props: DrawerPrimitive.Root.Props): React.ReactElement => <DrawerPrimitive.Root swipeDirection="down" {...props} />

export const DrawerTrigger = (props: DrawerPrimitive.Trigger.Props): React.ReactElement => (
  <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
)

export const DrawerClose = (props: DrawerPrimitive.Close.Props): React.ReactElement => <DrawerPrimitive.Close data-slot="drawer-close" {...props} />

export const DrawerPopup = ({ className, children, ...props }: DrawerPrimitive.Popup.Props): React.ReactElement => (
  <DrawerPrimitive.Portal>
    <DrawerPrimitive.Backdrop
      className="fixed inset-0 z-50 bg-black/32 opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-sm transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute"
      data-slot="drawer-backdrop"
    />
    <DrawerPrimitive.Viewport
      className="fixed inset-0 z-50 grid touch-none grid-rows-[1fr_auto] pt-12 [--bleed:--spacing(12)]"
      data-slot="drawer-viewport"
    >
      <DrawerPrimitive.Popup
        className={cn(
          'relative row-start-2 flex max-h-full min-h-0 w-full min-w-0 touch-none flex-col rounded-t-2xl border-t bg-popover not-dark:bg-clip-padding pb-[env(safe-area-inset-bottom,0px)] text-popover-foreground shadow-lg/5 outline-none transition-[transform,box-shadow,height,background-color] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform transform-[translateY(var(--drawer-swipe-movement-y))] before:pointer-events-none before:absolute before:inset-0 before:rounded-t-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-(--bleed) after:bg-popover has-data-[slot=drawer-bar]:pt-2 data-swiping:select-none data-ending-style:shadow-transparent data-starting-style:shadow-transparent data-ending-style:pb-0 data-starting-style:pb-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-ending-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)))] data-starting-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)))] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
          className
        )}
        data-slot="drawer-popup"
        {...props}
      >
        {children}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 flex touch-none items-center justify-center p-3 before:h-1 before:w-12 before:rounded-full before:bg-input"
          data-slot="drawer-bar"
        />
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport>
  </DrawerPrimitive.Portal>
)

export const DrawerHeader = ({ className, ...props }: React.ComponentProps<'div'>): React.ReactElement => (
  <div
    className={cn('flex cursor-default flex-col gap-2 p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pb-3 max-sm:pb-4', className)}
    data-slot="drawer-header"
    {...props}
  />
)

export const DrawerFooter = ({ className, ...props }: DrawerPrimitive.Content.Props): React.ReactElement => (
  <DrawerPrimitive.Content
    className={cn(
      'flex flex-col-reverse gap-2 border-t bg-muted/72 px-6 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+--spacing(4))] sm:flex-row sm:justify-end',
      className
    )}
    data-slot="drawer-footer"
    {...props}
  />
)

export const DrawerTitle = ({ className, ...props }: DrawerPrimitive.Title.Props): React.ReactElement => (
  <DrawerPrimitive.Title className={cn('font-heading font-semibold text-xl leading-none', className)} data-slot="drawer-title" {...props} />
)

export const DrawerPanel = ({ className, children, ...props }: DrawerPrimitive.Content.Props): React.ReactElement => (
  <ScrollArea className="touch-auto" scrollFade>
    <DrawerPrimitive.Content
      className={cn(
        'p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-header])]:pt-1 in-[[data-slot=drawer-popup]:has([data-slot=drawer-footer]:not(.border-t))]:pb-1',
        className
      )}
      data-slot="drawer-panel"
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  </ScrollArea>
)
