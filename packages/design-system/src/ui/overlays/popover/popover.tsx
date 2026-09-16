import { lazy, Suspense, type ReactElement, type ReactNode } from 'react'

import { useIsMobile } from '../../../hooks/use-is-mobile'

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
