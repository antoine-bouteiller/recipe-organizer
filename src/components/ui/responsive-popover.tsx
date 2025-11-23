import type { Popover as PopoverPrimitive } from '@base-ui-components/react/popover'
import { createContext, useContext, useMemo, type ReactNode } from 'react'

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  type DrawerOverlayProps,
  type DrawerTriggerProps,
} from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  type PopoverContentProps,
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
  nested?: boolean
}

const ResponsivePopover = ({ nested, ...props }: ResponsivePopoverProps) => {
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
        <Drawer nested={nested} {...props} />
      </ResponsivePopoverContext.Provider>
    )
  }

  return (
    <ResponsivePopoverContext.Provider value={contextValue}>
      <Popover {...props} />
    </ResponsivePopoverContext.Provider>
  )
}

const ResponsivePopoverTrigger = ({
  ...props
}: PopoverPrimitive.Trigger.Props & DrawerTriggerProps) => {
  const { isMobile } = useResponsivePopoverContext()

  if (isMobile) {
    return <DrawerTrigger {...props} />
  }

  return <PopoverTrigger {...props} />
}

const ResponsivePopoverContent = ({ ...props }: PopoverContentProps & DrawerOverlayProps) => {
  const { isMobile } = useResponsivePopoverContext()

  if (isMobile) {
    return <DrawerContent {...props} />
  }

  return <PopoverContent {...props} />
}

export { ResponsivePopover, ResponsivePopoverContent, ResponsivePopoverTrigger }
