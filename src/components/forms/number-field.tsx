import { FieldControl, FormItem, FieldLabel, FieldMessage } from '@/components/forms/form'
import { NumberInput } from '@/components/ui/number-input'
import { useFieldContext } from '@/hooks/use-form-context'
import { useMemo } from 'react'

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
  const { state, handleChange } = useFieldContext<number | undefined>()

  const stepper = useMemo(() => {
    if (!state.value || state.value < 5) {
      return decimalScale === 0 ? 1 : 0.5
    }

    if (state.value < 10) {
      return 1
    }

    if (state.value < 50) {
      return 5
    }

    return 10
  }, [decimalScale, state.value])

  return (
    <FormItem className="flex-1 w-full">
      {label && <FieldLabel className="text-base font-semibold">{label}</FieldLabel>}
      <FieldControl>
        <NumberInput
          placeholder={placeholder}
          min={min}
          max={max}
          decimalScale={decimalScale}
          stepper={stepper}
          onValueChange={handleChange}
          value={state.value}
          disabled={disabled}
        />
      </FieldControl>
      <FieldMessage />
    </FormItem>
  )
}
