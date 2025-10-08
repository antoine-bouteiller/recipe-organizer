import { createContext, useContext, type ComponentProps } from 'react'

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-is-mobile'

const ResponsivePopoverContext = createContext<{ isMobile: boolean }>({
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

const ResponsivePopover = ({ ...props }: ComponentProps<typeof Popover>) => {
  const isMobile = useIsMobile()
  const Root = isMobile ? Drawer : Popover
  return (
    <ResponsivePopoverContext.Provider value={{ isMobile }}>
      <Root {...props} />
    </ResponsivePopoverContext.Provider>
  )
}

const ResponsivePopoverTrigger = ({ ...props }: ComponentProps<typeof PopoverTrigger>) => {
  const { isMobile } = useResponsivePopoverContext()
  const Trigger = isMobile ? DrawerTrigger : PopoverTrigger
  return <Trigger {...props} />
}

const ResponsivePopoverContent = ({
  className,
  ...props
}: ComponentProps<typeof PopoverContent>) => {
  const { isMobile } = useResponsivePopoverContext()
  const Content = isMobile ? DrawerContent : PopoverContent
  return <Content className={className} {...props} />
}

export { ResponsivePopover, ResponsivePopoverContent, ResponsivePopoverTrigger }
