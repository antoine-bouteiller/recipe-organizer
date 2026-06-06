import { type ReactElement, type ReactNode } from 'react'

import { Drawer as DrawerRoot, DrawerPopup, DrawerTrigger } from '@/components/ui/drawer'
import { PopoverContent, Popover as PopoverRoot, PopoverTrigger } from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-is-mobile'

interface PopoverProps {
  trigger: ReactElement
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  contentClassName?: string
}

export const Popover = ({ trigger, children, open, defaultOpen, onOpenChange, contentClassName }: PopoverProps): ReactElement => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerRoot defaultOpen={defaultOpen} onOpenChange={onOpenChange} open={open}>
        <DrawerTrigger render={trigger} />
        <DrawerPopup className={contentClassName}>{children}</DrawerPopup>
      </DrawerRoot>
    )
  }

  return (
    <PopoverRoot defaultOpen={defaultOpen} onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined} open={open}>
      <PopoverTrigger render={trigger} />
      <PopoverContent className={contentClassName}>{children}</PopoverContent>
    </PopoverRoot>
  )
}
