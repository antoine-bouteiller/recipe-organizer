import { Show } from 'solid-js'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Select } from '@/components/ui/select'
import { useFieldContext } from '@/hooks/use-form-context'

interface SelectFieldProps {
  disabled?: boolean
  items: { label: string; value: string | null }[]
  label?: string
}

const SelectField = (props: SelectFieldProps) => {
  const field = useFieldContext<string | null | undefined>()

  return (
    <Field dirty={field().state.meta.isDirty} invalid={!field().state.meta.isValid} name={field().name} touched={field().state.meta.isTouched}>
      <Show when={props.label}>{(label) => <FieldLabel>{label()}</FieldLabel>}</Show>
      <Select
        disabled={props.disabled}
        items={props.items}
        onValueChange={(value) => field().setValue(value ?? undefined)}
        title={props.label}
        value={field().state.value ?? null}
      />
      <FieldError />
    </Field>
  )
}

export { SelectField }
