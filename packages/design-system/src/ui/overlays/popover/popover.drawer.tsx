import { type ReactElement } from 'react'

import { Drawer as DrawerRoot, DrawerPopup, DrawerTrigger } from '../drawer/drawer'
import { type PopoverProps } from './popover'

const PopoverDrawer = ({ trigger, children }: PopoverProps): ReactElement => (
  <DrawerRoot>
    <DrawerTrigger render={trigger} />
    <DrawerPopup>{children}</DrawerPopup>
  </DrawerRoot>
)

export default PopoverDrawer
