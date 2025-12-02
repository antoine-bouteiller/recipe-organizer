'use client'

import { Popover as PopoverPrimitive } from '@base-ui-components/react/popover'

import { cn } from '@/utils/cn'

const PopoverCreateHandle = PopoverPrimitive.createHandle

const Popover = PopoverPrimitive.Root

const PopoverTrigger = (props: PopoverPrimitive.Trigger.Props) => <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />

export type PopoverContentProps = PopoverPrimitive.Popup.Props & {
  align?: PopoverPrimitive.Positioner.Props['align']
  alignOffset?: PopoverPrimitive.Positioner.Props['alignOffset']
  side?: PopoverPrimitive.Positioner.Props['side']
  sideOffset?: PopoverPrimitive.Positioner.Props['sideOffset']
  tooltipStyle?: boolean
}

const PopoverPopup = ({
  align = 'center',
  alignOffset = 0,
  children,
  className,
  side = 'bottom',
  sideOffset = 4,
  tooltipStyle = false,
  ...props
}: PopoverContentProps) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      className={`
        z-50 h-(--positioner-height) w-(--positioner-width)
        max-w-(--available-width) transition-[top,left,right,bottom,transform]
        data-instant:transition-none
      `}
      data-slot="popover-positioner"
      side={side}
      sideOffset={sideOffset}
    >
      <PopoverPrimitive.Popup
        className={cn(
          `
            relative flex h-(--popup-height,auto) w-(--popup-width,auto)
            origin-(--transform-origin) rounded-lg border bg-popover
            bg-clip-padding text-popover-foreground shadow-lg
            transition-[width,height,scale,opacity]
            not-[class*='w-']:min-w-80
            before:pointer-events-none before:absolute before:inset-0
            before:rounded-[calc(var(--radius-lg)-1px)]
            before:shadow-[0_1px_--theme(--color-black/4%)]
            data-starting-style:scale-98 data-starting-style:opacity-0
            dark:bg-clip-border
            dark:before:shadow-[0_-1px_--theme(--color-white/8%)]
          `,
          tooltipStyle &&
            `
              w-fit rounded-md text-xs text-balance shadow-md shadow-black/5
              before:rounded-[calc(var(--radius-md)-1px)]
            `,
          className
        )}
        data-slot="popover-popup"
        {...props}
      >
        <PopoverPrimitive.Viewport
          className={cn(
            `
              relative size-full max-h-(--available-height) overflow-clip
              px-(--viewport-inline-padding) py-4 outline-none
              [--viewport-inline-padding:--spacing(4)]
              **:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)]
              **:data-current:opacity-100 **:data-current:transition-opacity
              **:data-current:data-ending-style:opacity-0
              data-instant:transition-none
              **:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)]
              **:data-previous:opacity-100 **:data-previous:transition-opacity
              **:data-previous:data-ending-style:opacity-0
              **:data-current:data-starting-style:opacity-0
              **:data-previous:data-starting-style:opacity-0
            `,
            tooltipStyle
              ? `
                py-1
                [--viewport-inline-padding:--spacing(2)]
              `
              : 'not-data-transitioning:overflow-y-auto'
          )}
          data-slot="popover-viewport"
        >
          {children}
        </PopoverPrimitive.Viewport>
      </PopoverPrimitive.Popup>
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
)

const PopoverClose = ({ ...props }: PopoverPrimitive.Close.Props) => <PopoverPrimitive.Close data-slot="popover-close" {...props} />

const PopoverTitle = ({ className, ...props }: PopoverPrimitive.Title.Props) => (
  <PopoverPrimitive.Title className={cn('text-lg leading-none font-semibold', className)} data-slot="popover-title" {...props} />
)

const PopoverDescription = ({ className, ...props }: PopoverPrimitive.Description.Props) => (
  <PopoverPrimitive.Description className={cn('text-sm text-muted-foreground', className)} data-slot="popover-description" {...props} />
)

export { Popover, PopoverClose, PopoverPopup as PopoverContent, PopoverCreateHandle, PopoverDescription, PopoverPopup, PopoverTitle, PopoverTrigger }
