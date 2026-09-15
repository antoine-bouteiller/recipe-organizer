import { useFieldContext } from '../../../hooks/use-form-context'
import { Checkbox } from '../checkbox/checkbox'
import { Field, FieldError, FieldLabel } from '../field/field'

interface CheckboxFieldProps {
  className?: string
  disabled?: boolean
  label?: string
}

export const CheckboxField = ({ className, disabled, label }: CheckboxFieldProps) => {
  const field = useFieldContext<boolean>()

  return (
    <Field
      className={className}
      dirty={field.state.meta.isDirty}
      invalid={!field.state.meta.isValid}
      name={field.name}
      touched={field.state.meta.isTouched}
    >
      <div className="flex items-center gap-2">
        <Checkbox checked={field.state.value ?? false} disabled={disabled} onCheckedChange={(checked) => field.handleChange(checked)} />
        {label && <FieldLabel className="cursor-pointer">{label}</FieldLabel>}
      </div>
      <FieldError />
    </Field>
  )
}
