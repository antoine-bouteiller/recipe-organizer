import { Show } from 'solid-js'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useFieldContext } from '@/hooks/use-form-context'

interface TextFieldProps {
  class?: string
  disabled?: boolean
  label?: string
  placeholder?: string
}

export const TextField = (props: TextFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <Field
      class={props.class}
      dirty={field().state.meta.isDirty}
      invalid={!field().state.meta.isValid}
      name={field().name}
      touched={field().state.meta.isTouched}
    >
      <Show when={props.label}>{(label) => <FieldLabel>{label()}</FieldLabel>}</Show>
      <Input
        disabled={props.disabled}
        onInput={(event) => field().handleChange(event.currentTarget.value)}
        placeholder={props.placeholder}
        value={field().state.value}
      />
      <FieldError />
    </Field>
  )
}
