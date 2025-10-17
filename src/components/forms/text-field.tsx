import { FieldControl, FormItem, FieldLabel, FieldMessage } from '@/components/forms/form'
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
      {label && <FieldLabel className="text-base font-semibold">{label}</FieldLabel>}
      <FieldControl>
        <Input
          className="text-base"
          placeholder={placeholder}
          disabled={disabled}
          value={state.value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </FieldControl>
      <FieldMessage />
    </FormItem>
  )
}
