import { useState } from 'react'
import type { ReactElement } from 'react'

import { useIsMobile } from '@/design-system/hooks/use-is-mobile'
import { CheckIcon } from '@/design-system/ui/data-display/icons'
import { Popover } from '@/design-system/ui/overlays/popover/popover'

import { SelectButton } from './select.shared'

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

export const Select = <TValue extends string>({
  'aria-invalid': ariaInvalid,
  disabled,
  items,
  onValueChange,
  placeholder = 'Sélectionner',
  title,
  value,
}: SelectProps<TValue>): ReactElement => {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const selected = items.find((item) => item.value === (value ?? null))
  return (
    <Popover
      onOpenChange={setOpen}
      open={open}
      renderTrigger={(props) => (
        <SelectButton {...props} aria-invalid={ariaInvalid || undefined} disabled={disabled}>
          <span className={shared.selectTextState[selected ? 'selected' : 'empty']}>{selected?.label ?? placeholder}</span>
        </SelectButton>
      )}
    >
      <div className={styles.content}>
        {isMobile && <h2 className={styles.title}>{title ?? placeholder}</h2>}
        <div className={styles.list}>
          {items.map((item) => (
            <button
              className={styles.item}
              key={item.value ?? 'none'}
              onClick={() => {
                onValueChange(item.value)
                setOpen(false)
              }}
              type="button"
            >
              <span className={styles.label}>{item.label}</span>
              {item === selected && (
                <span className={styles.icon}>
                  <CheckIcon size="sm" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </Popover>
  )
}
