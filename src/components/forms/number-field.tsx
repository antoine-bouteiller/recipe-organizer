import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/forms/form'
import { NumberInput } from '@/components/ui/number-input'
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
  const { state, handleChange } = useFieldContext<number | undefined>()

  return (
    <FormItem className="flex-1 w-full">
      {label && <FormLabel className="text-base font-semibold">{label}</FormLabel>}
      <FormControl>
        <NumberInput
          className="text-base"
          placeholder={placeholder}
          min={min}
          max={max}
          decimalScale={decimalScale}
          onValueChange={handleChange}
          value={state.value}
          disabled={disabled}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
