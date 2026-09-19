import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
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

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className={styles.wrapper}>
        <ToggleGroupPrimitive
          className={styles.group}
          data-slot="toggle-group"
          disabled={disabled}
          multiple
          onValueChange={(value) => field.handleChange(value)}
          value={field.state.value ?? []}
        >
          {items.map(({ label: itemLabel, value }) => (
            <span className={styles.item} key={value}>
              <Toggle value={value}>{itemLabel}</Toggle>
            </span>
          ))}
        </ToggleGroupPrimitive>
      </div>
      <FieldError />
    </Field>
  )
}
