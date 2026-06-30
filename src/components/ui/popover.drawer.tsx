import { type ReactElement } from 'react'

import { Drawer as DrawerRoot, DrawerPopup, DrawerTrigger } from '@/components/ui/drawer'
import { type PopoverProps } from '@/components/ui/popover'

const PopoverDrawer = ({ trigger, children }: PopoverProps): ReactElement => (
  <DrawerRoot>
    <DrawerTrigger render={trigger} />
    <DrawerPopup>{children}</DrawerPopup>
  </DrawerRoot>
)

export default PopoverDrawer
