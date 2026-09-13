import { Drawer as DrawerRoot, DrawerPopup, DrawerTrigger } from '@client/components/ui/drawer'
import { type PopoverProps } from '@client/components/ui/popover'
import { type ReactElement } from 'react'

const PopoverDrawer = ({ trigger, children }: PopoverProps): ReactElement => (
  <DrawerRoot>
    <DrawerTrigger render={trigger} />
    <DrawerPopup>{children}</DrawerPopup>
  </DrawerRoot>
)

export default PopoverDrawer
