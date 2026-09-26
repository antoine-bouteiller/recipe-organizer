import { useIsMobile } from '@design-system/hooks/use-is-mobile'
import { lazy, Suspense } from 'react'
import type { ReactElement, ReactNode } from 'react'

export interface PopoverProps {
  children: ReactNode
  trigger: ReactElement
}

const PopoverBase = lazy(() => import('./popover.base'))
const PopoverDrawer = lazy(() => import('./popover.drawer'))

export const Popover = (props: PopoverProps): ReactElement => {
  const Impl = useIsMobile() ? PopoverDrawer : PopoverBase
  return (
    <Suspense fallback={props.trigger}>
      <Impl {...props} />
    </Suspense>
  )
}
