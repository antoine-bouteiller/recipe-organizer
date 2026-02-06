import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Toggle, ToggleGroup } from '@/components/ui/toggle-group'
import { useFieldContext } from '@/hooks/use-form-context'

interface ToggleGroupFieldProps {
  className?: string
  disabled?: boolean
  items: { label: string; value: string }[]
  label?: string
}

export const ToggleGroupField = ({ className, disabled, items, label }: ToggleGroupFieldProps) => {
  const field = useFieldContext<string[]>()

  return (
    <Field
      className={className}
      dirty={field.state.meta.isDirty}
      invalid={!field.state.meta.isValid}
      name={field.name}
      touched={field.state.meta.isTouched}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <ToggleGroup
        className="flex-wrap"
        disabled={disabled}
        multiple
        onValueChange={(value) => field.handleChange(value)}
        value={field.state.value ?? []}
      >
        {items.map(({ label, value }) => (
          <Toggle key={value} value={value}>
            {label}
          </Toggle>
        ))}
      </ToggleGroup>
      <FieldError />
    </Field>
  )
}
