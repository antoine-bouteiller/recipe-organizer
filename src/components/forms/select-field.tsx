import { useFieldContext } from '@/hooks/use-form-context'

import { Field, FieldError, FieldLabel } from '../ui/field'
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '../ui/select'

interface SelectFieldProps {
  disabled?: boolean
  items: { label: string; value: string }[]
  label?: string
}

const SelectField = ({ disabled, items, label }: SelectFieldProps) => {
  const field = useFieldContext<string | undefined>()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Select disabled={disabled} items={items} onValueChange={(value) => field.setValue(value ?? undefined)} value={field.store.state.value}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {items.map(({ label, value }) => (
            <SelectItem className="justify-start" key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      <FieldError />
    </Field>
  )
}

export { SelectField }
