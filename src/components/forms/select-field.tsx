import { useFieldContext } from '@/hooks/use-form-context'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '../ui/select'

interface SelectFieldProps {
  label?: string
  items: { label: string; value: string }[]
  disabled?: boolean
}

const SelectField = ({ items, label, disabled }: SelectFieldProps) => {
  const field = useFieldContext<string | undefined>()

  return (
    <Field
      name={field.name}
      invalid={!field.state.meta.isValid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <Select
        items={items}
        disabled={disabled}
        onValueChange={(value) => field.setValue(value ?? undefined)}
        value={field.store.state.value}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {items.map(({ label, value }) => (
            <SelectItem key={value} value={value} className="justify-start">
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
