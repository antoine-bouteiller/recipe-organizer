import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { type ReactElement, type ReactNode } from 'react'

import { Button } from '../../actions/button/button'
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerPanel, DrawerPopup, Drawer as DrawerRoot, DrawerTitle } from '../drawer/drawer'
import { type DialogProps } from './dialog'
import { useDialogFormFrame } from './dialog-form.private'

const DialogDrawer = ({ title, trigger, children, cancelLabel, cancelDisabled, footer, open, onOpenChange }: DialogProps): ReactElement => {
  const formFrame = useDialogFormFrame()
  const hasFooter = cancelLabel !== undefined || footer !== undefined
  const content: ReactNode = (
    <>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
      </DrawerHeader>
      <DrawerPanel>{children}</DrawerPanel>
      {hasFooter && (
        <DrawerFooter>
          {cancelLabel !== undefined && <DrawerClose render={<Button disabled={cancelDisabled} variant="outline" />}>{cancelLabel}</DrawerClose>}
          {footer}
        </DrawerFooter>
      )}
    </>
  )
  return (
    <DrawerRoot onOpenChange={onOpenChange} open={open}>
      {trigger !== undefined && <DrawerPrimitive.Trigger data-slot="drawer-trigger" render={trigger} />}
      <DrawerPopup>{formFrame?.wrap(content) ?? content}</DrawerPopup>
    </DrawerRoot>
  )
}

export default DialogDrawer
