import { type JSX, lazy, Show, Suspense } from 'solid-js'

import { type TriggerRender } from '@/components/ui/dialog'
import { useIsMobile } from '@/hooks/use-is-mobile'

export interface PopoverProps {
  trigger: TriggerRender
  children: JSX.Element
}

const PopoverBase = lazy(() => import('@/components/ui/popover.base'))
const PopoverDrawer = lazy(() => import('@/components/ui/popover.drawer'))

export const Popover = (props: PopoverProps) => {
  const isMobile = useIsMobile()

  return (
    <Suspense>
      <Show when={isMobile()} fallback={<PopoverBase {...props} />}>
        <PopoverDrawer {...props} />
      </Show>
    </Suspense>
  )
}
