import { DrawerPopup, Drawer as DrawerRoot, DrawerTrigger } from '@/components/ui/drawer'
import { type PopoverProps } from '@/components/ui/popover'

const PopoverDrawer = (props: PopoverProps) => (
  <DrawerRoot>
    {props.trigger((triggerProps) => (
      <DrawerTrigger data-slot="drawer-trigger" {...triggerProps} />
    ))}
    <DrawerPopup>{props.children}</DrawerPopup>
  </DrawerRoot>
)

export default PopoverDrawer
