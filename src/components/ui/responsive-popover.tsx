import type { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { createContext, useContext, type ReactNode } from 'react'

import type { DrawerPrimitive } from '@/components/ui/drawer'
import { Drawer, DrawerPopup, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

const ResponsivePopover = ({ ...props }: ResponsivePopoverProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <ResponsivePopoverContext.Provider value={{ isMobile }}>
        <Drawer {...props} />
      </ResponsivePopoverContext.Provider>
    )
  }

  return (
    <ResponsivePopoverContext.Provider value={{ isMobile }}>
      <Popover {...props} />
    </ResponsivePopoverContext.Provider>
  )
}

const ResponsivePopoverTrigger = ({ ...props }: DrawerPrimitive.Trigger.Props & PopoverPrimitive.Trigger.Props) => {
  const { isMobile } = useResponsivePopoverContext()

  if (isMobile) {
    return <DrawerTrigger {...props} />
  }

  return <PopoverTrigger {...props} />
}

const ResponsivePopoverContent = (props: PopoverPrimitive.Popup.Props & DrawerPrimitive.Content.Props) => {
  const { isMobile } = useResponsivePopoverContext()

  if (isMobile) {
    return <DrawerPopup {...props} />
  }

  return <PopoverContent {...props} />
}

export { ResponsivePopover, ResponsivePopoverContent, ResponsivePopoverTrigger }
