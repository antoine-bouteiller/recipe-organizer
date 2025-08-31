import { FormItem, FormMessage } from '@/components/forms/form'
import { SearchSelect } from '@/components/ui/searchselect'
import { useFieldContext } from '@/hooks/use-form-context'

interface Option {
  label: string
  value: string
}

interface SearchSelectFieldProps {
  label?: string
  placeholder?: string
  disabled?: boolean
  options: Option[]
}

const SearchSelectField = ({ options }: SearchSelectFieldProps) => {
  const field = useFieldContext<string | undefined>()

  return (
    <FormItem className="flex-1 w-full">
      <SearchSelect
        options={options}
        value={field.store.state.value}
        onChange={(option) => {
          if (option.value === field.store.state.value) {
            field.handleChange(undefined)
          } else {
            field.handleChange(option.value)
          }
        }}
        error={field.errors.length > 0 ? field.errors[0].message : undefined}
      />
      <FormMessage />
    </FormItem>
  )
}

export { SearchSelectField, type Option, type SearchSelectFieldProps }
