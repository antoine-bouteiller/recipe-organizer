import { DrawerPopup, Drawer as DrawerRoot, DrawerTrigger } from '@/components/ui/drawer'
import { type PopoverProps } from '@/components/ui/popover'

const PopoverDrawer = (props: PopoverProps) => (
  <DrawerRoot>
    <DrawerTrigger data-slot="drawer-trigger" {...props.trigger} />
    <DrawerPopup>{props.children}</DrawerPopup>
  </DrawerRoot>
)

export default PopoverDrawer
