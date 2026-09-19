import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { Button } from '@recipe-organizer/design-system/button'
import { type ReactElement, type ReactNode } from 'react'

import { DrawerHeader, DrawerPanel, DrawerPopup, Drawer as DrawerRoot, DrawerTitle } from '../drawer/drawer'
import { type DialogProps } from './dialog'
import { useDialogFormFrame } from './dialog-form.private'

import * as drawerStyles from '../drawer/drawer.css'

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
        <DrawerPrimitive.Content className={drawerStyles.footer()} data-slot="drawer-footer">
          {cancelLabel !== undefined && (
            <DrawerPrimitive.Close data-slot="drawer-close" disabled={cancelDisabled} render={<Button variant="outline" />}>
              {cancelLabel}
            </DrawerPrimitive.Close>
          )}
          {footer}
        </DrawerPrimitive.Content>
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
