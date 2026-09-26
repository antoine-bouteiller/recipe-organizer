import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import type { ReactElement } from 'react'

import type { PopoverProps } from './popover'

import * as styles from './popover.base.css'

const PopoverBase = ({ trigger, children }: PopoverProps): ReactElement => (
  <PopoverPrimitive.Root>
    <PopoverPrimitive.Trigger data-slot="popover-trigger" render={trigger} />
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner align="center" className={styles.positioner()} data-slot="popover-positioner" side="bottom" sideOffset={4}>
        <PopoverPrimitive.Popup className={styles.popup()} data-slot="popover-popup">
          <PopoverPrimitive.Viewport className={styles.viewport()} data-slot="popover-viewport">
            {children}
          </PopoverPrimitive.Viewport>
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  </PopoverPrimitive.Root>
)
export default PopoverBase
