import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useFieldContext } from '@/hooks/use-form-context'

interface TextFieldProps {
  label?: string
  placeholder?: string
  disabled?: boolean
}

export const TextField = ({ label, placeholder, disabled }: TextFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <Field
      name={field.name}
      invalid={!field.state.meta.isValid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <Input
        placeholder={placeholder}
        disabled={disabled}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldError />
    </Field>
  )
}
