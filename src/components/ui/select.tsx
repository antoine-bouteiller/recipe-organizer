import { lazy, Suspense, type ReactElement } from 'react'

import { getSelectDisplay, SelectButton, type SelectButtonProps } from '@/components/ui/select.shared'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { cn } from '@/utils/cn'

interface SelectOption<TValue extends string> {
  label: string
  value: TValue | null
}

interface SelectBaseProps<TValue extends string> {
  items: SelectOption<TValue>[]
  placeholder?: string
  title?: string
  disabled?: boolean
  className?: string
  size?: SelectButtonProps['size']
}

export type SelectProps<TValue extends string> = SelectBaseProps<TValue> &
  (
    | { multiple?: false; value: TValue | null | undefined; onValueChange: (value: TValue | null) => void }
    | { multiple: true; value: TValue[]; onValueChange: (value: TValue[]) => void }
  )

const SelectBase = lazy(() => import('@/components/ui/select.base'))
const SelectDrawer = lazy(() => import('@/components/ui/select.drawer'))

export const Select = <TValue extends string>(props: SelectProps<TValue>): ReactElement => {
  const isMobile = useIsMobile()
  const { displayLabel, isEmpty } = getSelectDisplay(props)
  const Impl = (isMobile ? SelectDrawer : SelectBase) as unknown as (props: SelectProps<TValue>) => ReactElement

  return (
    <Suspense
      fallback={
        <SelectButton className={props.className} disabled={props.disabled} size={props.size}>
          <span className={cn(isEmpty && 'text-muted-foreground')}>{displayLabel}</span>
        </SelectButton>
      }
    >
      <Impl {...props} />
    </Suspense>
  )
}
