import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { Control, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form'

interface TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  placeholder?: string
  disabled?: boolean
}

export const TextField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  disabled,
}: TextFieldProps<TFieldValues, TName>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }: { field: ControllerRenderProps<TFieldValues, TName> }) => (
      <FormItem>
        {label && <FormLabel className="text-base font-semibold">{label}</FormLabel>}
        <FormControl>
          <Input className="text-base" placeholder={placeholder} {...field} disabled={disabled} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)
