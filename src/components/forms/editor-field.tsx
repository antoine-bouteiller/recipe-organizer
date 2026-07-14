import { type JSX, Show } from 'solid-js'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/use-form-context'

interface EditorFieldProps {
  disabled?: boolean
  extraToolbar?: JSX.Element
  label?: string
  nodes?: readonly unknown[]
}

const EditorField = (props: EditorFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <Field dirty={field().state.meta.isDirty} invalid={!field().state.meta.isValid} name={field().name} touched={field().state.meta.isTouched}>
      <Show when={props.label}>{(label) => <FieldLabel>{label()}</FieldLabel>}</Show>
      <textarea
        class="min-h-32 w-full rounded-lg border border-input bg-background p-3 text-base text-muted-foreground sm:text-sm"
        disabled
        placeholder="Éditeur de texte enrichi indisponible (migration en cours)"
        value={field().state.value ?? ''}
      />
      <FieldError />
    </Field>
  )
}

export default EditorField
