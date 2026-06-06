import { type Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { createContext, useContext, type ReactNode } from 'react'

import { Drawer, DrawerPopup, DrawerTrigger, type DrawerPrimitive } from '@/components/ui/drawer'
import { PopoverContent as PopoverContentPrimitive, Popover as PopoverRoot, PopoverTrigger as PopoverTriggerPrimitive } from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-is-mobile'

interface PopoverContextValue {
  isMobile: boolean
}

const PopoverContext = createContext<PopoverContextValue>({
  isMobile: false,
})

const usePopoverContext = () => {
  const context = useContext(PopoverContext)
  if (!context) {
    throw new Error('usePopoverContext must be used within a Popover')
  }
  return context
}

interface PopoverProps {
  children?: ReactNode
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

const PopoverComponent = ({ ...props }: PopoverProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <PopoverContext.Provider value={{ isMobile }}>
        <Drawer {...props} />
      </PopoverContext.Provider>
    )
  }

  return (
    <PopoverContext.Provider value={{ isMobile }}>
      <PopoverRoot {...props} />
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = ({ ...props }: DrawerPrimitive.Trigger.Props & PopoverPrimitive.Trigger.Props) => {
  const { isMobile } = usePopoverContext()

  if (isMobile) {
    return <DrawerTrigger {...props} />
  }

  return <PopoverTriggerPrimitive {...props} />
}

const PopoverContent = (props: PopoverPrimitive.Popup.Props & DrawerPrimitive.Content.Props) => {
  const { isMobile } = usePopoverContext()

  if (isMobile) {
    return <DrawerPopup {...props} />
  }

  return <PopoverContentPrimitive {...props} />
}

const Popover = Object.assign(PopoverComponent, {
  Content: PopoverContent,
  Trigger: PopoverTrigger,
})

export { Popover }
