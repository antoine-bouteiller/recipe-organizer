import { Field } from '@/components/common/field'
import { Input } from '@/components/common/input'
import { useFieldContext } from '@/hooks/use-form-context'

interface TextFieldProps {
  className?: string
  disabled?: boolean
  label?: string
  placeholder?: string
}

export const TextField = ({ className, disabled, label, placeholder }: TextFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <Field
      className={className}
      dirty={field.state.meta.isDirty}
      invalid={!field.state.meta.isValid}
      name={field.name}
      touched={field.state.meta.isTouched}
    >
      {label && <Field.Label>{label}</Field.Label>}
      <Input disabled={disabled} onChange={(event) => field.handleChange(event.target.value)} placeholder={placeholder} value={field.state.value} />
      <Field.Error />
    </Field>
  )
}
