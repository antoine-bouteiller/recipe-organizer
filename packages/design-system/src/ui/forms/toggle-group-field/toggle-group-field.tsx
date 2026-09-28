import { useFieldContext } from '@design-system/hooks/use-form-context'
import { Toggle } from '@recipe-organizer/design-system/toggle'

import { Field, FieldError, FieldLabel } from '../field/field'

import * as styles from './toggle-group-field.css'

export interface ToggleGroupFieldProps {
  disabled?: boolean
  items: { label: string; value: string }[]
  label?: string
}

export const ToggleGroupField = ({ disabled, items, label }: ToggleGroupFieldProps) => {
  const field = useFieldContext<string[]>()
  const selected = field.state.value ?? []

  return (
    <Field invalid={!field.state.meta.isValid} name={field.name}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className={styles.wrapper}>
        <div className={styles.group} data-slot="toggle-group">
          {items.map(({ label: itemLabel, value }) => (
            <span className={styles.item} key={value}>
              <Toggle
                disabled={disabled}
                onPressedChange={(pressed) => field.handleChange(pressed ? [...selected, value] : selected.filter((item) => item !== value))}
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
