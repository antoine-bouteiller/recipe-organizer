import { cn } from 'cn'
import { lazy, Suspense, type ReactElement } from 'react'

import { getSelectDisplay, SelectButton, type SelectButtonProps } from '@/components/ui/select.shared'
import { useIsMobile } from '@/hooks/use-is-mobile'

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
  // Lazy boundaries erase the generic, so impls emit plain strings: map them back to typed option values.
  const typedValue = (value: string | null): TValue | null => props.items.find((item) => item.value === value)?.value ?? null
  const implProps: SelectProps<string> = props.multiple
    ? { ...props, multiple: true, onValueChange: (values: string[]) => props.onValueChange(values.map(typedValue).filter((value) => value !== null)) }
    : { ...props, multiple: false, onValueChange: (value: string | null) => props.onValueChange(typedValue(value)) }

  return (
    <Suspense
      fallback={
        <SelectButton className={props.className} disabled={props.disabled} size={props.size}>
          <span className={cn(isEmpty && 'text-muted-foreground')}>{displayLabel}</span>
        </SelectButton>
      }
    >
      {isMobile ? <SelectDrawer {...implProps} /> : <SelectBase {...implProps} />}
    </Suspense>
  )
}
