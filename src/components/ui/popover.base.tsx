import { Popover as PopoverPrimitive } from '@kobalte/core/popover'

import { type PopoverProps } from '@/components/ui/popover'

const PopoverBase = (props: PopoverProps) => (
  <PopoverPrimitive gutter={4} placement="bottom">
    {props.trigger((triggerProps) => (
      <PopoverPrimitive.Trigger data-slot="popover-trigger" {...triggerProps} />
    ))}
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        class="z-50 max-w-(--kb-popper-content-available-width) origin-[var(--kb-popover-content-transform-origin)] rounded-lg border bg-popover px-4 py-4 text-popover-foreground shadow-lg/5 outline-none not-dark:bg-clip-padding data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:animate-in data-expanded:fade-in-0 data-expanded:zoom-in-95"
        data-slot="popover-popup"
      >
        {props.children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  </PopoverPrimitive>
)

export default PopoverBase
