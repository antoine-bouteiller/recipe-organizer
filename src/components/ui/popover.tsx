import { Popover as PopoverPrimitive } from '@base-ui-components/react/popover'

import { cn } from '@/utils/cn'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = (props: PopoverPrimitive.Trigger.Props) => (
  <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
)

export type PopoverContentProps = PopoverPrimitive.Popup.Props & {
  side?: PopoverPrimitive.Positioner.Props['side']
  align?: PopoverPrimitive.Positioner.Props['align']
  sideOffset?: PopoverPrimitive.Positioner.Props['sideOffset']
  alignOffset?: PopoverPrimitive.Positioner.Props['alignOffset']
  tooltipStyle?: boolean
}

const PopoverPopup = ({
  children,
  className,
  side = 'bottom',
  align = 'center',
  sideOffset = 4,
  alignOffset = 0,
  tooltipStyle = false,
  ...props
}: PopoverContentProps) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      className="z-50"
      data-slot="popover-positioner"
      side={side}
      sideOffset={sideOffset}
    >
      <span
        className={cn(
          "relative flex origin-(--transform-origin) rounded-lg border bg-popover bg-clip-padding shadow-lg transition-[scale,opacity] not-[class*='w-']:[min-w-80] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] has-data-starting-style:scale-98 has-data-starting-style:opacity-0 dark:bg-clip-border dark:before:shadow-[0_-1px_--theme(--color-white/8%)]",
          tooltipStyle &&
            'w-fit text-balance rounded-md text-xs shadow-black/5 shadow-md before:rounded-[calc(var(--radius-md)-1px)]'
        )}
      >
        <PopoverPrimitive.Popup
          className={cn(
            'max-h-(--available-height) w-full overflow-y-auto outline-none',
            tooltipStyle && 'px-[calc(--spacing(2)+1px)] py-[calc(--spacing(1)+1px)]',
            className
          )}
          data-slot="popover-content"
          {...props}
        >
          {children}
        </PopoverPrimitive.Popup>
      </span>
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
)

const PopoverClose = ({ ...props }: PopoverPrimitive.Close.Props) => (
  <PopoverPrimitive.Close data-slot="popover-close" {...props} />
)

const PopoverTitle = ({ className, ...props }: PopoverPrimitive.Title.Props) => (
  <PopoverPrimitive.Title
    className={cn('font-semibold text-lg leading-none', className)}
    data-slot="popover-title"
    {...props}
  />
)

const PopoverDescription = ({ className, ...props }: PopoverPrimitive.Description.Props) => (
  <PopoverPrimitive.Description
    className={cn('text-muted-foreground text-sm', className)}
    data-slot="popover-description"
    {...props}
  />
)

export {
  Popover,
  PopoverClose,
  PopoverPopup as PopoverContent,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
}
