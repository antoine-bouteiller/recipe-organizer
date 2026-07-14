import { type JSX, lazy, Show, Suspense, type ValidComponent } from 'solid-js'

import { useIsMobile } from '@/hooks/use-is-mobile'

export interface TriggerConfig {
  as?: ValidComponent
  children?: JSX.Element
  class?: string
  [key: string]: unknown
}

export interface DialogProps {
  title: string
  trigger?: TriggerConfig
  children: JSX.Element
  cancelLabel?: string
  cancelDisabled?: boolean
  footer?: JSX.Element
  open?: boolean
  onOpenChange?: (open: boolean) => void
  contentRender?: (content: JSX.Element) => JSX.Element
  panelClassName?: string
}

const DialogBase = lazy(() => import('@/components/ui/dialog.base'))
const DialogDrawer = lazy(() => import('@/components/ui/dialog.drawer'))

export const Dialog = (props: DialogProps) => {
  const isMobile = useIsMobile()

  return (
    <Suspense>
      <Show when={isMobile()} fallback={<DialogBase {...props} />}>
        <DialogDrawer {...props} />
      </Show>
    </Suspense>
  )
}
