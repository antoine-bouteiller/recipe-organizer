import { useIsMobile } from '@design-system/hooks/use-is-mobile'
import { CaretUpDownIcon } from '@recipe-organizer/design-system/icons/caret-up-down'
import type { ReactElement } from 'react'

import SelectDrawer from './select.drawer'

import * as styles from './select.css'
import * as shared from './select.shared.css'

interface SelectOption<TValue extends string> {
  label: string
  value: TValue | null
}

export interface SelectProps<TValue extends string> {
  'aria-invalid'?: boolean
  disabled?: boolean
  id?: string
  items: SelectOption<TValue>[]
  onValueChange: (value: TValue | null) => void
  placeholder?: string
  title?: string
  value: TValue | null | undefined
}

const NativeSelect = <TValue extends string>({
  'aria-invalid': ariaInvalid,
  disabled,
  id,
  items,
  onValueChange,
  placeholder = 'Sélectionner',
  value,
}: SelectProps<TValue>): ReactElement => (
  <span className={styles.wrapper}>
    <select
      aria-invalid={ariaInvalid || undefined}
      className={`${shared.selectTrigger} ${styles.select} ${shared.selectTextState[value ? 'selected' : 'empty']}`}
      data-slot="select"
      disabled={disabled}
      id={id}
      onChange={(event) => onValueChange(items.find((item) => (item.value ?? '') === event.target.value)?.value ?? null)}
      value={value ?? ''}
    >
      {!items.some((item) => item.value === null) && <option value="">{placeholder}</option>}
      {items.map((item) => (
        <option key={item.value ?? ''} value={item.value ?? ''}>
          {item.label}
        </option>
      ))}
    </select>
    <span className={styles.icon}>
      <CaretUpDownIcon />
    </span>
  </span>
)

export const Select = <TValue extends string>(props: SelectProps<TValue>): ReactElement => {
  const isMobile = useIsMobile()
  if (!isMobile) {
    return <NativeSelect {...props} />
  }
  return <SelectDrawer {...props} onValueChange={(value) => props.onValueChange(props.items.find((item) => item.value === value)?.value ?? null)} />
}
