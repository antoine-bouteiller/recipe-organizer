import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Select } from '@/components/ui/select'
import { useFieldContext } from '@/hooks/use-form-context'

interface SelectFieldProps {
  disabled?: boolean
  items: { label: string; value: string | null }[]
  label?: string
}

const SelectField = ({ disabled, items, label }: SelectFieldProps) => {
  const field = useFieldContext<string | null | undefined>()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Select
        disabled={disabled}
        items={items}
        onValueChange={(value) => field.setValue(value ?? undefined)}
        title={label}
        value={field.store.state.value ?? null}
      />
      <FieldError />
    </Field>
  )
}

export { SelectField }
