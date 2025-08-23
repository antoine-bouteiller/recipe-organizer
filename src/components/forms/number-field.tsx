import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { NumberInput } from '@/components/ui/number-input'
import type { Control, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form'

interface NumberFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  placeholder?: string
  disabled?: boolean
  min?: number
  max?: number
  decimalScale?: number
}

export const NumberField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  disabled,
  min,
  max,
  decimalScale,
}: NumberFieldProps<TFieldValues, TName>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }: { field: ControllerRenderProps<TFieldValues, TName> }) => (
      <FormItem className="flex-1 w-full">
        {label && <FormLabel className="text-base font-semibold">{label}</FormLabel>}
        <FormControl>
          <NumberInput
            className="text-base"
            placeholder={placeholder}
            min={min}
            max={max}
            decimalScale={decimalScale}
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)
