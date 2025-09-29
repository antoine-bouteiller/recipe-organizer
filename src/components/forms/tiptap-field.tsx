import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/forms/form'
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
      <FormLabel className="text-base font-semibold">{label}</FormLabel>
      <FormControl>
        <Tiptap disabled={disabled} onChange={handleChange} content={state.value} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default TiptapField
