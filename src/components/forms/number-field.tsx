import { Field, FieldError } from '@/components/ui/field'
import { NumberInput } from '@/components/ui/number-input'
import { useFieldContext } from '@/hooks/use-form-context'

interface NumberFieldProps {
  class?: string
  disabled?: boolean
  label?: string
  max?: number
  min?: number
  placeholder?: string
}

export const NumberField = (props: NumberFieldProps) => {
  const field = useFieldContext<number | undefined>()

  return (
    <Field
      class={props.class}
      dirty={field().state.meta.isDirty}
      invalid={!field().state.meta.isValid}
      name={field().name}
      touched={field().state.meta.isTouched}
    >
      <NumberInput
        disabled={props.disabled}
        label={props.label}
        max={props.max}
        min={props.min}
        onChange={(value) => field().handleChange(Number.isNaN(value) ? undefined : value)}
        placeholder={props.placeholder}
        value={field().state.value}
      />
      <FieldError />
    </Field>
  )
}
