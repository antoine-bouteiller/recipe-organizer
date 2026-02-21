import type { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { createContext, type ReactNode, useContext } from 'react'

import { Drawer, type DrawerOverlayProps, DrawerPopup, DrawerTrigger, type DrawerTriggerProps } from '@/components/ui/drawer'
import { Popover, PopoverContent, type PopoverContentProps, PopoverTrigger } from '@/components/ui/popover'
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
    throw new Error('useResponsivePopoverContext must be used within a ResponsivePopoverContext.Provider')
  }
  return context
}

interface ResponsivePopoverProps {
  children?: ReactNode
  defaultOpen?: boolean
  nested?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

const ResponsivePopover = ({ nested, ...props }: ResponsivePopoverProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <ResponsivePopoverContext.Provider value={{ isMobile }}>
        <Drawer nested={nested} {...props} />
      </ResponsivePopoverContext.Provider>
    )
  }

  return (
    <ResponsivePopoverContext.Provider value={{ isMobile }}>
      <Popover {...props} />
    </ResponsivePopoverContext.Provider>
  )
}

const ResponsivePopoverTrigger = ({ ...props }: DrawerTriggerProps & PopoverPrimitive.Trigger.Props) => {
  const { isMobile } = useResponsivePopoverContext()

  if (isMobile) {
    return <DrawerTrigger {...props} />
  }

  return <PopoverTrigger {...props} />
}

const ResponsivePopoverContent = ({ ...props }: DrawerOverlayProps & PopoverContentProps & { noPadding?: boolean }) => {
  const { isMobile } = useResponsivePopoverContext()

  if (isMobile) {
    return <DrawerPopup {...props} />
  }

  return <PopoverContent {...props} />
}

export { ResponsivePopover, ResponsivePopoverContent, ResponsivePopoverTrigger }
