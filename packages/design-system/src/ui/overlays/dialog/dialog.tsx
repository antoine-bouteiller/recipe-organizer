import { lazy, Suspense, type ReactElement, type ReactNode } from 'react'

import { useIsMobile } from '../../../hooks/use-is-mobile'

export interface DialogProps {
  cancelDisabled?: boolean
  cancelLabel?: string
  children: ReactNode
  footer?: ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: string
  trigger?: ReactElement
}

const DialogBase = lazy(() => import('./dialog.base'))
const DialogDrawer = lazy(() => import('./dialog.drawer'))

export const Dialog = (props: DialogProps): ReactElement => {
  const isMobile = useIsMobile()
  const Impl = isMobile ? DialogDrawer : DialogBase

  return (
    <Suspense fallback={props.trigger ?? null}>
      <Impl {...props} />
    </Suspense>
  )
}
