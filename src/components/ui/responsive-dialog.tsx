import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-is-mobile'
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from 'react'

interface ResponsiveDialogContextValue {
  isMobile: boolean
}

const ResponsiveDialogContext = createContext<ResponsiveDialogContextValue>({ isMobile: false })

const useResponsiveDialogContext = () => {
  const context = useContext(ResponsiveDialogContext)
  if (!context) {
    throw new Error('useResponsiveDialogContext must be used within a ResponsiveDialogProvider')
  }
  return context
}

interface ResponsiveDialogProps {
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
}

const ResponsiveDialog = ({ onOpenChange, modal, ...props }: ResponsiveDialogProps) => {
  const isMobile = useIsMobile()

  const mobileContextValue = useMemo(() => ({ isMobile: true }), [])
  const desktopContextValue = useMemo(() => ({ isMobile: false }), [])

  if (isMobile) {
    return (
      <ResponsiveDialogContext.Provider value={mobileContextValue}>
        <Drawer onOpenChange={onOpenChange} modal={modal} {...props} />
      </ResponsiveDialogContext.Provider>
    )
  }

  let dialogModal: boolean | 'trap-focus' = 'trap-focus'
  if (modal === true) {
    dialogModal = true
  } else if (modal === false) {
    dialogModal = false
  }

  return (
    <ResponsiveDialogContext.Provider value={desktopContextValue}>
      <Dialog
        onOpenChange={
          onOpenChange
            ? (open, _eventDetails) => {
                onOpenChange(open)
              }
            : undefined
        }
        modal={dialogModal}
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

const ResponsiveDialogClose = ({ children, render, ...props }: ResponsiveDialogCloseProps) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerClose {...props}>{children}</DrawerClose>
  }

  if (render) {
    return (
      <DialogClose render={render} {...props}>
        {children}
      </DialogClose>
    )
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
