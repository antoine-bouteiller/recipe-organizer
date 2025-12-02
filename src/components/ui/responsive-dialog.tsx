import { type ComponentPropsWithoutRef, createContext, type ReactNode, useContext } from 'react'

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
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

interface ResponsiveDialogContentProps {
  children?: ReactNode
  className?: string
}

const ResponsiveDialogContent = ({ ...props }: ResponsiveDialogContentProps) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerContent {...props} />
  }

  return <DialogContent {...props} />
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

interface ResponsiveDialogTitleProps {
  children?: ReactNode
  className?: string
}

const ResponsiveDialogTitle = ({ ...props }: ResponsiveDialogTitleProps) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerTitle {...props} />
  }

  return <DialogTitle {...props} />
}

interface ResponsiveDialogFooterProps {
  children?: ReactNode
  className?: string
}

const ResponsiveDialogFooter = ({ ...props }: ResponsiveDialogFooterProps) => {
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
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
}
