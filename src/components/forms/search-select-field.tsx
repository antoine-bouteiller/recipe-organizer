import { FormField, FormItem, FormMessage } from '@/components/ui/form'
import { SearchSelect } from '@/components/ui/searchselect'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

interface Option {
  label: string
  value: string
}

interface SearchSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  placeholder?: string
  disabled?: boolean
  options: Option[]
}

const SearchSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  options,
}: SearchSelectFieldProps<TFieldValues, TName>) => (
  <FormField
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <FormItem className="w-full">
        <SearchSelect
          options={options}
          value={field.value}
          onChange={(option) => {
            field.onChange(option.value)
          }}
          error={fieldState.error?.message}
        />
        <FormMessage />
      </FormItem>
    )}
  />
)

export { SearchSelectField, type Option, type SearchSelectFieldProps }
