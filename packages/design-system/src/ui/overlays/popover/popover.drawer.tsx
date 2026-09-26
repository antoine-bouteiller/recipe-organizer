import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import type { ReactElement } from 'react'

import { Drawer as DrawerRoot, DrawerPopup } from '../drawer/drawer'
import type { PopoverProps } from './popover'

const PopoverDrawer = ({ trigger, children }: PopoverProps): ReactElement => (
  <DrawerRoot>
    <DrawerPrimitive.Trigger data-slot="drawer-trigger" render={trigger} />
    <DrawerPopup>{children}</DrawerPopup>
  </DrawerRoot>
)

export default PopoverDrawer
