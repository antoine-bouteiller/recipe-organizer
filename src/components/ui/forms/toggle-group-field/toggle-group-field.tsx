import { Toggle } from '@/components/ui/actions/toggle/toggle'

import { Field, FieldError, FieldLabel, useFieldInvalid } from '../field/field'

import * as styles from './toggle-group-field.css'

export interface ToggleGroupFieldProps<TValue extends string> {
  name: string
  value: TValue[]
  onChange: (value: TValue[]) => void
  disabled?: boolean
  items: { label: string; value: TValue }[]
  label?: string
}

export const ToggleGroupField = <TValue extends string>({
  name,
  value: selected,
  onChange,
  disabled,
  items,
  label,
}: ToggleGroupFieldProps<TValue>) => {
  const invalid = useFieldInvalid(name)

  return (
    <Field name={name}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className={styles.wrapper}>
        <div className={styles.group} data-slot="toggle-group">
          {items.map(({ label: itemLabel, value }) => (
            <span className={styles.item} key={value}>
              <Toggle
                aria-invalid={invalid || undefined}
                disabled={disabled}
                onPressedChange={(pressed) => onChange(pressed ? [...selected, value] : selected.filter((item) => item !== value))}
                pressed={selected.includes(value)}
              >
                {itemLabel}
              </Toggle>
            </span>
          ))}
        </div>
      </div>
      <FieldError />
    </Field>
  )
}
