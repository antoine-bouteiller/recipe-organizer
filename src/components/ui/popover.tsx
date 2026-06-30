import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { type ReactElement, type ReactNode } from 'react'

import { Drawer as DrawerRoot, DrawerPopup, DrawerTrigger } from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { cn } from '@/utils/cn'

const PopoverRoot = PopoverPrimitive.Root

const PopoverTrigger = ({ className, children, ...props }: PopoverPrimitive.Trigger.Props): ReactElement => (
  <PopoverPrimitive.Trigger className={className} data-slot="popover-trigger" {...props}>
    {children}
  </PopoverPrimitive.Trigger>
)

const PopoverContent = ({ children, className, ...props }: PopoverPrimitive.Popup.Props): ReactElement => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner
      align="center"
      className="z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] data-instant:transition-none"
      data-slot="popover-positioner"
      side="bottom"
      sideOffset={4}
    >
      <PopoverPrimitive.Popup
        className={cn(
          'relative flex h-(--popup-height,auto) w-(--popup-width,auto) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 outline-none transition-[width,height,scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] has-data-[slot=calendar]:rounded-xl has-data-[slot=calendar]:before:rounded-[calc(var(--radius-xl)-1px)] data-starting-style:scale-98 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
          className
        )}
        data-slot="popover-popup"
        {...props}
      >
        <PopoverPrimitive.Viewport
          className="relative size-full max-h-(--available-height) overflow-clip px-(--viewport-inline-padding) py-4 [--viewport-inline-padding:--spacing(4)] not-data-transitioning:overflow-y-auto has-data-[slot=calendar]:p-2 **:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-current:opacity-100 **:data-current:transition-opacity **:data-current:data-ending-style:opacity-0 data-instant:transition-none **:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:opacity-100 **:data-previous:transition-opacity **:data-previous:data-ending-style:opacity-0 **:data-current:data-starting-style:opacity-0 **:data-previous:data-starting-style:opacity-0"
          data-slot="popover-viewport"
        >
          {children}
        </PopoverPrimitive.Viewport>
      </PopoverPrimitive.Popup>
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
)

interface PopoverProps {
  trigger: ReactElement
  children: ReactNode
}

export const Popover = ({ trigger, children }: PopoverProps): ReactElement => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerRoot>
        <DrawerTrigger render={trigger} />
        <DrawerPopup>{children}</DrawerPopup>
      </DrawerRoot>
    )
  }

  return (
    <PopoverRoot>
      <PopoverTrigger render={trigger} />
      <PopoverContent>{children}</PopoverContent>
    </PopoverRoot>
  )
}
