import { FieldControl, FieldLabel, FormItem, FieldMessage } from '@/components/forms/form'
import { Tiptap } from '@/components/ui/tiptap'
import { useFieldContext } from '@/hooks/use-form-context'

interface TiptapProps {
  label?: string
  disabled?: boolean
}

const TiptapField = ({ label, disabled }: TiptapProps) => {
  const { state, handleChange } = useFieldContext<string>()

  return (
    <FormItem>
      <FieldLabel className="text-base font-semibold">{label}</FieldLabel>
      <FieldControl>
        <Tiptap disabled={disabled} onChange={handleChange} content={state.value} />
      </FieldControl>
      <FieldMessage />
    </FormItem>
  )
}

export default TiptapField
