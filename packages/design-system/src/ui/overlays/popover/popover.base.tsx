import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { type ReactElement } from 'react'

import { type PopoverProps } from './popover'

import { positionerClassName, popupClassName, viewportClassName } from './popover.base.css'

type TriggerProps = Pick<PopoverPrimitive.Trigger.Props, 'render'>

const PopoverTrigger = ({ render }: TriggerProps): ReactElement => <PopoverPrimitive.Trigger data-slot="popover-trigger" render={render} />
const PopoverContent = ({ children }: Pick<PopoverProps, 'children'>): ReactElement => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner align="center" className={positionerClassName()} data-slot="popover-positioner" side="bottom" sideOffset={4}>
      <PopoverPrimitive.Popup className={popupClassName()} data-slot="popover-popup">
        <PopoverPrimitive.Viewport className={viewportClassName()} data-slot="popover-viewport">
          {children}
        </PopoverPrimitive.Viewport>
      </PopoverPrimitive.Popup>
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
)
const PopoverBase = ({ trigger, children }: PopoverProps): ReactElement => (
  <PopoverPrimitive.Root>
    <PopoverTrigger render={trigger} />
    <PopoverContent>{children}</PopoverContent>
  </PopoverPrimitive.Root>
)
export default PopoverBase
