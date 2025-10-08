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
import { createContext, useContext, type ComponentProps } from 'react'

const ResponsiveDialogContext = createContext<{ isMobile: boolean }>({ isMobile: false })

const useResponsiveDialogContext = () => {
  const context = useContext(ResponsiveDialogContext)
  if (!context) {
    throw new Error('useResponsiveDialogContext must be used within a ResponsiveDialogProvider')
  }
  return context
}

const ResponsiveDialog = ({ ...props }: ComponentProps<typeof Dialog>) => {
  const isMobile = useIsMobile()
  const Root = isMobile ? Drawer : Dialog
  return (
    <ResponsiveDialogContext.Provider value={{ isMobile }}>
      <Root {...props} />
    </ResponsiveDialogContext.Provider>
  )
}

const ResponsiveDialogTrigger = ({ className, ...props }: ComponentProps<typeof DialogTrigger>) => {
  const { isMobile } = useResponsiveDialogContext()
  const Trigger = isMobile ? DrawerTrigger : DialogTrigger
  return <Trigger className={className} {...props} />
}

const ResponsiveDialogContent = ({ className, ...props }: ComponentProps<typeof DialogContent>) => {
  const { isMobile } = useResponsiveDialogContext()
  const Content = isMobile ? DrawerContent : DialogContent
  return <Content className={className} {...props} />
}

const ResponsiveDialogHeader = ({ className, ...props }: ComponentProps<typeof DialogHeader>) => {
  const { isMobile } = useResponsiveDialogContext()
  const Header = isMobile ? DrawerHeader : DialogHeader
  return <Header className={className} {...props} />
}

const ResponsiveDialogTitle = ({ className, ...props }: ComponentProps<typeof DialogTitle>) => {
  const { isMobile } = useResponsiveDialogContext()
  const Title = isMobile ? DrawerTitle : DialogTitle
  return <Title className={className} {...props} />
}

const ResponsiveDialogFooter = ({ className, ...props }: ComponentProps<typeof DialogFooter>) => {
  const { isMobile } = useResponsiveDialogContext()
  const Footer = isMobile ? DrawerFooter : DialogFooter
  return <Footer className={className} {...props} />
}

const ResponsiveDialogClose = ({ className, ...props }: ComponentProps<typeof DialogClose>) => {
  const { isMobile } = useResponsiveDialogContext()
  const Close = isMobile ? DrawerClose : DialogClose
  return <Close className={className} {...props} />
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
