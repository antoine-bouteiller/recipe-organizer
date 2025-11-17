import { createContext, useContext, useMemo, type ReactNode } from 'react'

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  type DrawerTriggerProps,
} from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverPositioner,
  PopoverTrigger,
  type PopoverPositionerProps,
  type PopoverTriggerProps,
} from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-is-mobile'

interface ResponsivePopoverContextValue {
  isMobile: boolean
}

const ResponsivePopoverContext = createContext<ResponsivePopoverContextValue>({
  isMobile: false,
})

const useResponsivePopoverContext = () => {
  const context = useContext(ResponsivePopoverContext)
  if (!context) {
    throw new Error(
      'useResponsivePopoverContext must be used within a ResponsivePopoverContext.Provider'
    )
  }
  return context
}

interface ResponsivePopoverProps {
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
}

const ResponsivePopover = ({ onOpenChange, modal, ...props }: ResponsivePopoverProps) => {
  const isMobile = useIsMobile()

  const contextValue = useMemo(
    () => ({
      isMobile,
    }),
    [isMobile]
  )

  if (isMobile) {
    return (
      <ResponsivePopoverContext.Provider value={contextValue}>
        <Drawer onOpenChange={onOpenChange} modal={modal} {...props} />
      </ResponsivePopoverContext.Provider>
    )
  }

  return (
    <ResponsivePopoverContext.Provider value={contextValue}>
      <Popover onOpenChange={onOpenChange} {...props} />
    </ResponsivePopoverContext.Provider>
  )
}

const ResponsivePopoverTrigger = ({
  children,
  ...props
}: PopoverTriggerProps & DrawerTriggerProps) => {
  const { isMobile } = useResponsivePopoverContext()

  if (isMobile) {
    return <DrawerTrigger {...props}>{children}</DrawerTrigger>
  }

  return <PopoverTrigger {...props}>{children}</PopoverTrigger>
}

interface ResponsivePopoverContentProps extends Omit<PopoverPositionerProps, 'className'> {
  className?: string
}

const ResponsivePopoverContent = ({
  children,
  className,
  ...props
}: ResponsivePopoverContentProps) => {
  const { isMobile } = useResponsivePopoverContext()

  if (isMobile) {
    return <DrawerContent className={className}>{children}</DrawerContent>
  }

  return (
    <PopoverPositioner {...props}>
      <PopoverContent className={className}>{children}</PopoverContent>
    </PopoverPositioner>
  )
}

export { ResponsivePopover, ResponsivePopoverContent, ResponsivePopoverTrigger }
