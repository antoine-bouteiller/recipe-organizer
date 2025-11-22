import { Field, FieldControl, FieldError, FieldLabel } from '@/components/ui/field'
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
      className="w-full"
    >
      <FieldLabel>{label}</FieldLabel>
      <FieldControl
        disabled={disabled}
        render={<Tiptap onChange={field.handleChange} content={field.state.value} />}
        className="w-full"
      />

      <FieldError />
    </Field>
  )
}

export default TiptapField
