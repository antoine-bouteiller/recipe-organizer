import { DrawerPreview as DrawerPrimitive } from '@base-ui/react/drawer'
import * as React from 'react'

import { cn } from '@/utils/cn'

import { ScrollArea } from './scroll-area'

const Drawer = ({ nested: _nested, ...props }: DrawerPrimitive.Root.Props & { nested?: boolean }) => <DrawerPrimitive.Root {...props} />

export type DrawerTriggerProps = DrawerPrimitive.Trigger.Props

const DrawerTrigger = (props: DrawerTriggerProps) => <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />

const DrawerPortal = (props: DrawerPrimitive.Portal.Props) => <DrawerPrimitive.Portal {...props} />

const DrawerClose = (props: DrawerPrimitive.Close.Props) => <DrawerPrimitive.Close data-slot="drawer-close" {...props} />

const DrawerBackdrop = ({ className, ...props }: DrawerPrimitive.Backdrop.Props) => (
  <DrawerPrimitive.Backdrop
    className={cn(
      'fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0',
      className
    )}
    data-slot="drawer-backdrop"
    {...props}
  />
)

export interface DrawerContentProps {
  children?: React.ReactNode
  className?: string
}

const DrawerPopup = ({ children, className }: DrawerContentProps) => (
  <DrawerPortal>
    <DrawerBackdrop />
    <DrawerPrimitive.Viewport className="fixed inset-0 z-50 flex items-end justify-center" data-slot="drawer-viewport">
      <DrawerPrimitive.Popup
        className={cn(
          'relative flex w-full flex-col rounded-t-2xl border-t bg-popover text-popover-foreground shadow-md',
          'h-(--drawer-height,auto) max-h-[calc(80vh+3rem)] overflow-y-auto overscroll-contain -mb-12 pb-12',
          'origin-[50%_calc(100%-3rem)] transform-[translateY(var(--translate-y))_scale(var(--stack-scale))] will-change-transform',
          'transition-[transform,height,box-shadow] duration-450 ease-out-snappy',
          'data-swiping:duration-0 data-swiping:select-none data-nested-drawer-swiping:duration-0',
          'data-nested-drawer-open:h-[calc(var(--stack-height)+3rem)] data-nested-drawer-open:overflow-hidden',
          'data-starting-style:transform-[translateY(calc(100%-3rem))]',
          'data-ending-style:transform-[translateY(calc(100%-3rem))] data-ending-style:shadow-transparent data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
          'after:absolute after:inset-0 after:pointer-events-none after:rounded-[inherit] after:transition-colors after:duration-450 after:ease-out-snappy',
          'data-nested-drawer-open:after:bg-black/5',
          className
        )}
        data-slot="drawer-popup"
        style={
          {
            '--stack-scale': 'calc(max(0, 1 - var(--nested-drawers) * 0.05) + 0.05 * clamp(0, var(--drawer-swipe-progress), 1))',
            '--stack-height': 'max(0px, var(--drawer-frontmost-height, var(--drawer-height)) - 3rem)',
            '--translate-y':
              'calc(var(--drawer-swipe-movement-y) - max(0px, (var(--nested-drawers) - clamp(0, var(--drawer-swipe-progress), 1)) * 1rem) - (1 - var(--stack-scale)) * var(--stack-height))',
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            'mx-auto mt-4 h-1 w-25 shrink-0 rounded-full bg-popover-foreground/50',
            'transition-opacity duration-300 ease-out-bouncy',
            'in-data-nested-drawer-open:opacity-0',
            'in-data-nested-drawer-open:in-data-nested-drawer-swiping:opacity-100'
          )}
          data-slot="drawer-handle"
        />
        <DrawerPrimitive.Content
          className={cn(
            'transition-opacity duration-300 ease-out-bouncy',
            'in-data-nested-drawer-open:opacity-0',
            'in-data-nested-drawer-open:in-data-nested-drawer-swiping:opacity-100'
          )}
          data-slot="drawer-content"
        >
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport>
  </DrawerPortal>
)

const DrawerHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex flex-col gap-0.5 p-4 text-center md:gap-1.5 md:text-left', className)} data-slot="drawer-header" {...props} />
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

const DrawerTitle = ({ className, ...props }: DrawerPrimitive.Title.Props) => (
  <DrawerPrimitive.Title className={cn('font-semibold text-foreground', className)} data-slot="drawer-title" {...props} />
)

const DrawerDescription = ({ className, ...props }: DrawerPrimitive.Description.Props) => (
  <DrawerPrimitive.Description className={cn('text-sm text-muted-foreground', className)} data-slot="drawer-description" {...props} />
)

export {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
}
