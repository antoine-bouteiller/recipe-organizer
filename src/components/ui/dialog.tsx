import { lazy, Suspense, type ReactElement, type ReactNode } from 'react'

import { useIsMobile } from '@/hooks/use-is-mobile'

export interface DialogProps {
  title: string
  trigger?: ReactElement
  children: ReactNode
  cancelLabel?: string
  cancelDisabled?: boolean
  footer?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  contentRender?: (content: ReactNode) => ReactNode
  panelClassName?: string
}

const DialogBase = lazy(() => import('@/components/ui/dialog.base'))
const DialogDrawer = lazy(() => import('@/components/ui/dialog.drawer'))

export const Dialog = (props: DialogProps): ReactElement => {
  const isMobile = useIsMobile()
  const Impl = isMobile ? DialogDrawer : DialogBase

  return (
    <Suspense fallback={props.trigger ?? null}>
      <Impl {...props} />
    </Suspense>
  )
}
