import { type ReactElement, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  Dialog as DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { useIsMobile } from '@/hooks/use-is-mobile'

interface DialogProps {
  title: string
  trigger?: ReactElement
  children: ReactNode
  cancelLabel?: string
  cancelDisabled?: boolean
  footer?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  contentRender?: (content: ReactNode) => ReactNode
  panelClassName?: string
}

export const Dialog = ({
  title,
  trigger,
  children,
  cancelLabel,
  cancelDisabled,
  footer,
  open,
  defaultOpen,
  onOpenChange,
  modal,
  contentRender,
  panelClassName,
}: DialogProps): ReactElement => {
  const isMobile = useIsMobile()
  const hasFooter = cancelLabel !== undefined || footer !== undefined
  const wrap = (body: ReactNode): ReactNode => (contentRender ? contentRender(body) : body)

  if (isMobile) {
    return (
      <DrawerRoot defaultOpen={defaultOpen} modal={modal} onOpenChange={onOpenChange} open={open}>
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

  let dialogModal: 'trap-focus' | boolean = 'trap-focus'
  if (modal === true) {
    dialogModal = true
  } else if (modal === false) {
    dialogModal = false
  }

  return (
    <DialogRoot defaultOpen={defaultOpen} modal={dialogModal} onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined} open={open}>
      {trigger !== undefined && <DialogTrigger render={trigger} />}
      <DialogPopup>
        {wrap(
          <>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <DialogPanel className={panelClassName}>{children}</DialogPanel>
            {hasFooter && (
              <DialogFooter>
                {cancelLabel !== undefined && (
                  <DialogClose render={<Button disabled={cancelDisabled} variant="outline" />}>{cancelLabel}</DialogClose>
                )}
                {footer}
              </DialogFooter>
            )}
          </>
        )}
      </DialogPopup>
    </DialogRoot>
  )
}
