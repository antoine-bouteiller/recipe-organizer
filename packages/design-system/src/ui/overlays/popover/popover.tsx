import { lazy, Suspense, type ReactElement, type ReactNode } from 'react'

import { useIsMobile } from '../../../hooks/use-is-mobile'

export interface PopoverProps {
  trigger: ReactElement
  children: ReactNode
}

const PopoverBase = lazy(() => import('./popover.base'))
const PopoverDrawer = lazy(() => import('./popover.drawer'))

export const Popover = (props: PopoverProps): ReactElement => {
  const isMobile = useIsMobile()
  const Impl = isMobile ? PopoverDrawer : PopoverBase

  return (
    <Suspense fallback={props.trigger}>
      <Impl {...props} />
    </Suspense>
  )
}
