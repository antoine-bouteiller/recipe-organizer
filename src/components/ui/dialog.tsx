import { createContext, useContext, type ComponentPropsWithoutRef, type ReactNode } from 'react'

import {
  Dialog as DialogRoot,
  DialogClose as DialogClosePrimitive,
  DialogFooter as DialogFooterPrimitive,
  DialogHeader as DialogHeaderPrimitive,
  DialogPanel as DialogPanelPrimitive,
  DialogPopup as DialogPopupPrimitive,
  DialogTitle as DialogTitlePrimitive,
  DialogTrigger as DialogTriggerPrimitive,
} from '@/components/ui/primitive/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/primitive/drawer'
import { useIsMobile } from '@/hooks/use-is-mobile'

interface DialogContextValue {
  isMobile: boolean
}

const DialogContext = createContext<DialogContextValue>({
  isMobile: false,
})

const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialogContext must be used within a Dialog')
  }
  return context
}

interface DialogProps {
  children?: ReactNode
  defaultOpen?: boolean
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

const DialogComponent = ({ modal, onOpenChange, ...props }: DialogProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DialogContext.Provider value={{ isMobile }}>
        <Drawer modal={modal} onOpenChange={onOpenChange} {...props} />
      </DialogContext.Provider>
    )
  }

  let dialogModal: 'trap-focus' | boolean = 'trap-focus'
  if (modal === true) {
    dialogModal = true
  } else if (modal === false) {
    dialogModal = false
  }

  return (
    <DialogContext.Provider value={{ isMobile }}>
      <DialogRoot
        modal={dialogModal}
        onOpenChange={
          onOpenChange
            ? (open, _eventDetails) => {
                onOpenChange(open)
              }
            : undefined
        }
        {...props}
      />
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps {
  children?: ReactNode
  className?: string
  render?: ComponentPropsWithoutRef<typeof DialogTriggerPrimitive>['render']
}

const DialogTrigger = ({ children, ...props }: DialogTriggerProps) => {
  const { isMobile } = useDialogContext()

  if (isMobile) {
    return <DrawerTrigger {...props}>{children}</DrawerTrigger>
  }

  return <DialogTriggerPrimitive {...props}>{children}</DialogTriggerPrimitive>
}

interface DialogContentProps {
  children?: ReactNode
  className?: string
}

const DialogPopup = ({ ...props }: DialogContentProps) => {
  const { isMobile } = useDialogContext()

  if (isMobile) {
    return <DrawerPopup {...props} />
  }

  return <DialogPopupPrimitive {...props} />
}

const DialogHeader = ({ ...props }: DialogContentProps) => {
  const { isMobile } = useDialogContext()

  if (isMobile) {
    return <DrawerHeader {...props} />
  }

  return <DialogHeaderPrimitive {...props} />
}

const DialogTitle = ({ ...props }: DialogContentProps) => {
  const { isMobile } = useDialogContext()

  if (isMobile) {
    return <DrawerTitle {...props} />
  }

  return <DialogTitlePrimitive {...props} />
}

const DialogPanel = ({ ...props }: DialogContentProps) => {
  const { isMobile } = useDialogContext()

  if (isMobile) {
    return <DrawerPanel {...props} />
  }

  return <DialogPanelPrimitive {...props} />
}

const DialogFooter = ({ ...props }: DialogContentProps) => {
  const { isMobile } = useDialogContext()

  if (isMobile) {
    return <DrawerFooter {...props} />
  }

  return <DialogFooterPrimitive {...props} />
}

interface DialogCloseProps {
  children?: ReactNode
  className?: string
  render?: ComponentPropsWithoutRef<typeof DialogClosePrimitive>['render']
}

const DialogClose = ({ children, ...props }: DialogCloseProps) => {
  const { isMobile } = useDialogContext()

  if (isMobile) {
    return <DrawerClose {...props}>{children}</DrawerClose>
  }

  return <DialogClosePrimitive {...props}>{children}</DialogClosePrimitive>
}

const Dialog = Object.assign(DialogComponent, {
  Close: DialogClose,
  Footer: DialogFooter,
  Header: DialogHeader,
  Panel: DialogPanel,
  Popup: DialogPopup,
  Title: DialogTitle,
  Trigger: DialogTrigger,
})

export { Dialog }
