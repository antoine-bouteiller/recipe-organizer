import { type ComponentProps, type JSX, lazy, Show, Suspense, type ValidComponent } from 'solid-js'

import { useIsMobile } from '@/hooks/use-is-mobile'

type PolymorphicTriggerProps<T extends ValidComponent> = { as?: T; children?: JSX.Element } & ComponentProps<T>
type TriggerFacade = <T extends ValidComponent>(props: PolymorphicTriggerProps<T>) => JSX.Element
export type TriggerRender = (Trigger: TriggerFacade) => JSX.Element

export interface DialogProps {
  title: string
  trigger?: TriggerRender
  children: JSX.Element
  cancelLabel?: string
  cancelDisabled?: boolean
  footer?: JSX.Element
  open?: boolean
  onOpenChange?: (open: boolean) => void
  contentRender?: (content: JSX.Element) => JSX.Element
  panelClassName?: string
}

export const dialogHasFooter = (props: DialogProps) => props.cancelLabel !== undefined || props.footer !== undefined
export const dialogWrap = (props: DialogProps, body: JSX.Element): JSX.Element => (props.contentRender ? props.contentRender(body) : body)

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
