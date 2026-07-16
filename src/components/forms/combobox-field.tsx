import { type JSX, Show } from 'solid-js'

import { Combobox, type ValueOptions } from '@/components/ui/combobox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/use-form-context'
import { type Option } from '@/hooks/use-options'

interface ComboboxFieldProps<TValue extends ValueOptions> {
  addNew?: (inputValue: string) => JSX.Element
  class?: string
  disabled?: boolean
  label?: string
  options: Option<TValue>[]
  placeholder?: string
  searchPlaceholder?: string
}

const ComboboxField = <TValue extends ValueOptions>(props: ComboboxFieldProps<TValue>) => {
  const field = useFieldContext<TValue | undefined>()

  const handleSelect = (option: Option<TValue> | null) => {
    if (option === null || option.value === field().state.value || option.value === undefined) {
      field().setValue(undefined)
    } else {
      field().setValue(option.value)
    }
  }

  return (
    <Field
      class={props.class}
      dirty={field().state.meta.isDirty}
      invalid={!field().state.meta.isValid}
      name={field().name}
      touched={field().state.meta.isTouched}
    >
      <Show when={props.label}>{(label) => <FieldLabel>{label()}</FieldLabel>}</Show>
      <Combobox
        addNew={props.addNew}
        disabled={props.disabled}
        isInvalid={field().state.meta.isTouched && !field().state.meta.isValid}
        onChange={handleSelect}
        options={props.options}
        placeholder={props.placeholder}
        searchPlaceholder={props.searchPlaceholder}
        title={props.label ?? props.placeholder}
        value={field().state.value}
      />
      <FieldError />
    </Field>
  )
}

export { ComboboxField }
