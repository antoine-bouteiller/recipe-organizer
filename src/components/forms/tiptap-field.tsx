import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Tiptap } from '@/components/ui/tiptap'
import { useFieldContext } from '@/hooks/use-form-context'

interface TiptapProps {
  label?: string
  disabled?: boolean
}

const TiptapField = ({ label, disabled }: TiptapProps) => {
  const field = useFieldContext<string>()

  return (
    <Field
      name={field.name}
      invalid={!field.state.meta.isValid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
    >
      <FieldLabel>{label}</FieldLabel>
      <Tiptap onChange={field.handleChange} content={field.state.value} disabled={disabled} />
      <FieldError />
    </Field>
  )
}

export default TiptapField
