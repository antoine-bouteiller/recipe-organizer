import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/forms/form'
import { Input } from '@/components/ui/input'
import { useFieldContext } from '@/hooks/use-form-context'

interface TextFieldProps {
  label?: string
  placeholder?: string
  disabled?: boolean
}

export const TextField = ({ label, placeholder, disabled }: TextFieldProps) => {
  const { state, handleChange } = useFieldContext<string>()

  return (
    <FormItem>
      {label && <FormLabel className="text-base font-semibold">{label}</FormLabel>}
      <FormControl>
        <Input
          className="text-base"
          placeholder={placeholder}
          disabled={disabled}
          value={state.value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
