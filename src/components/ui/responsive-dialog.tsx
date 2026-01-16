import { type ComponentPropsWithoutRef, createContext, type ReactNode, useContext } from 'react'

import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerFooter, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-is-mobile'

interface ResponsiveDialogContextValue {
  isMobile: boolean
}

const ResponsiveDialogContext = createContext<ResponsiveDialogContextValue>({
  isMobile: false,
})

const useResponsiveDialogContext = () => {
  const context = useContext(ResponsiveDialogContext)
  if (!context) {
    throw new Error('useResponsiveDialogContext must be used within a ResponsiveDialogProvider')
  }
  return context
}

interface ResponsiveDialogProps {
  children?: ReactNode
  defaultOpen?: boolean
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

const ResponsiveDialog = ({ modal, onOpenChange, ...props }: ResponsiveDialogProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <ResponsiveDialogContext.Provider value={{ isMobile }}>
        <Drawer modal={modal} onOpenChange={onOpenChange} {...props} />
      </ResponsiveDialogContext.Provider>
    )
  }

  let dialogModal: 'trap-focus' | boolean = 'trap-focus'
  if (modal === true) {
    dialogModal = true
  } else if (modal === false) {
    dialogModal = false
  }

  return (
    <ResponsiveDialogContext.Provider value={{ isMobile }}>
      <Dialog
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
    </ResponsiveDialogContext.Provider>
  )
}

interface ResponsiveDialogTriggerProps {
  children?: ReactNode
  className?: string
  render?: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
}

const ResponsiveDialogTrigger = ({ children, ...props }: ResponsiveDialogTriggerProps) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerTrigger {...props}>{children}</DrawerTrigger>
  }

  return <DialogTrigger {...props}>{children}</DialogTrigger>
}

interface ResponsiveDialogPopupProps {
  children?: ReactNode
  className?: string
}

const ResponsiveDialogPopup = ({ ...props }: ResponsiveDialogPopupProps) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerPopup {...props} />
  }

  return <DialogPopup {...props} />
}

interface ResponsiveDialogHeaderProps {
  children?: ReactNode
  className?: string
}

const ResponsiveDialogHeader = ({ ...props }: ResponsiveDialogHeaderProps) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerHeader {...props} />
  }

  return <DialogHeader {...props} />
}

interface ResponsiveDialogContentProps {
  children?: ReactNode
  className?: string
}

const ResponsiveDialogTitle = ({ ...props }: ResponsiveDialogContentProps) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerTitle {...props} />
  }

  return <DialogTitle {...props} />
}

const ResponsiveDialogPanel = ({ ...props }: ResponsiveDialogContentProps) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerPanel {...props} />
  }

  return <DialogPanel {...props} />
}

const ResponsiveDialogFooter = ({ ...props }: ResponsiveDialogContentProps) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerFooter {...props} />
  }

  return <DialogFooter {...props} />
}

interface ResponsiveDialogCloseProps {
  children?: ReactNode
  className?: string
  render?: ComponentPropsWithoutRef<typeof DialogClose>['render']
}

const ResponsiveDialogClose = ({ children, ...props }: ResponsiveDialogCloseProps) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerClose {...props}>{children}</DrawerClose>
  }

  return <DialogClose {...props}>{children}</DialogClose>
}

export {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogPanel,
  ResponsiveDialogPopup,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
}
