import { type ReactElement, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { type DialogProps } from '@/components/ui/dialog'
import {
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  Drawer as DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

const DialogDrawer = ({
  title,
  trigger,
  children,
  cancelLabel,
  cancelDisabled,
  footer,
  open,
  onOpenChange,
  contentRender,
  panelClassName,
}: DialogProps): ReactElement => {
  const hasFooter = cancelLabel !== undefined || footer !== undefined
  const wrap = (body: ReactNode): ReactNode => (contentRender ? contentRender(body) : body)

  return (
    <DrawerRoot onOpenChange={onOpenChange} open={open}>
      {trigger !== undefined && <DrawerTrigger render={trigger} />}
      <DrawerPopup>
        {wrap(
          <>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>
            <DrawerPanel className={panelClassName}>{children}</DrawerPanel>
            {hasFooter && (
              <DrawerFooter>
                {cancelLabel !== undefined && (
                  <DrawerClose render={<Button disabled={cancelDisabled} variant="outline" />}>{cancelLabel}</DrawerClose>
                )}
                {footer}
              </DrawerFooter>
            )}
          </>
        )}
      </DrawerPopup>
    </DrawerRoot>
  )
}

export default DialogDrawer
