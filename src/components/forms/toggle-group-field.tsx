import { Show } from 'solid-js'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { useFieldContext } from '@/hooks/use-form-context'

interface ToggleGroupFieldProps {
  class?: string
  disabled?: boolean
  items: { label: string; value: string }[]
  label?: string
}

export const ToggleGroupField = (props: ToggleGroupFieldProps) => {
  const field = useFieldContext<string[]>()

  return (
    <Field
      class={props.class}
      dirty={field().state.meta.isDirty}
      invalid={!field().state.meta.isValid}
      name={field().name}
      touched={field().state.meta.isTouched}
    >
      <Show when={props.label}>{(label) => <FieldLabel>{label()}</FieldLabel>}</Show>
      <ToggleGroup disabled={props.disabled} items={props.items} onValueChange={(value) => field().handleChange(value)} value={field().state.value ?? []} />
      <FieldError />
    </Field>
  )
}
