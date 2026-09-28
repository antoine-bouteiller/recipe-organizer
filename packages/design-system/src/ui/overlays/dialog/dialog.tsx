import { useIsMobile } from '@design-system/hooks/use-is-mobile'
import type { ReactElement, ReactNode } from 'react'

import DialogBase from './dialog.base'
import DialogDrawer from './dialog.drawer'

export interface DialogProps {
  /** Render children directly in the popup, without the header, panel, footer, and close button. */
  bare?: boolean
  cancelDisabled?: boolean
  cancelLabel?: string
  children: ReactNode
  footer?: ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: string
  trigger?: ReactElement
}

export const Dialog = ({ onOpenChange, cancelDisabled, ...props }: DialogProps): ReactElement => {
  const isMobile = useIsMobile()
  const Impl = isMobile ? DialogDrawer : DialogBase
  const handleOpenChange = (nextOpen: boolean, eventDetails?: { cancel: () => void }): void => {
    if (!nextOpen && cancelDisabled) {
      eventDetails?.cancel()
      return
    }
    onOpenChange?.(nextOpen)
  }
  return <Impl {...props} cancelDisabled={cancelDisabled} onOpenChange={handleOpenChange} />
}
