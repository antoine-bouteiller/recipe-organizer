import { Field, FieldError } from '@/components/ui/field'
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputScrubArea,
} from '@/components/ui/number-input'
import { useFieldContext } from '@/hooks/use-form-context'

interface NumberFieldProps {
  label?: string
  placeholder?: string
  disabled?: boolean
  min?: number
  max?: number
  decimalScale?: number
}

export const NumberField = ({
  label,
  placeholder,
  disabled,
  min,
  max,
  decimalScale,
}: NumberFieldProps) => {
  const field = useFieldContext<number | undefined>()

  let stepper = 1
  if (!field.state.value || field.state.value < 5) {
    stepper = decimalScale === 0 ? 1 : 0.5
  } else if (field.state.value < 10) {
    stepper = 1
  } else if (field.state.value < 50) {
    stepper = 5
  } else {
    stepper = 10
  }

  return (
    <Field
      name={field.name}
      invalid={!field.state.meta.isValid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
    >
      <NumberInput
        defaultValue={field.state.value}
        max={max}
        min={min}
        step={stepper}
        onValueChange={(value) => field.handleChange(value ?? undefined)}
        disabled={disabled}
      >
        {label && <NumberInputScrubArea label={label} />}
        <NumberInputGroup>
          <NumberInputDecrement />
          <NumberInputField placeholder={placeholder} />
          <NumberInputIncrement />
        </NumberInputGroup>
      </NumberInput>
      <FieldError />
    </Field>
  )
}
