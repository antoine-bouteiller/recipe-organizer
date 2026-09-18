import { useIsMobile } from '@design-system/hooks/use-is-mobile'
import { lazy, Suspense, type ReactElement } from 'react'

import { getSelectDisplay, SelectButton, selectText } from './select.shared'

interface SelectOption<TValue extends string> {
  label: string
  value: TValue | null
}

interface SelectBaseProps<TValue extends string> {
  items: SelectOption<TValue>[]
  placeholder?: string
  title?: string
  disabled?: boolean
}

export type SelectProps<TValue extends string> = SelectBaseProps<TValue> &
  (
    | { multiple?: false; value: TValue | null | undefined; onValueChange: (value: TValue | null) => void }
    | { multiple: true; value: TValue[]; onValueChange: (value: TValue[]) => void }
  )

const SelectBase = lazy(() => import('./select.base'))
const SelectDrawer = lazy(() => import('./select.drawer'))

export const Select = <TValue extends string>(props: SelectProps<TValue>): ReactElement => {
  const isMobile = useIsMobile()
  const { displayLabel, isEmpty } = getSelectDisplay(props)
  const typedValue = (value: string | null): TValue | null => props.items.find((item) => item.value === value)?.value ?? null
  const implProps: SelectProps<string> = props.multiple
    ? {
        disabled: props.disabled,
        items: props.items,
        multiple: true,
        onValueChange: (values: string[]) => props.onValueChange(values.map(typedValue).filter((value) => value !== null)),
        placeholder: props.placeholder,
        title: props.title,
        value: props.value,
      }
    : {
        disabled: props.disabled,
        items: props.items,
        multiple: false,
        onValueChange: (value: string | null) => props.onValueChange(typedValue(value)),
        placeholder: props.placeholder,
        title: props.title,
        value: props.value,
      }

  return (
    <Suspense
      fallback={
        <SelectButton disabled={props.disabled}>
          <span className={selectText(isEmpty)}>{displayLabel}</span>
        </SelectButton>
      }
    >
      {isMobile ? <SelectDrawer {...implProps} /> : <SelectBase {...implProps} />}
    </Suspense>
  )
}
