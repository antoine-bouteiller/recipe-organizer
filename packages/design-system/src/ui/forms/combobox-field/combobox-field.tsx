import { type ReactNode } from 'react'

import { useFieldContext } from '../../../hooks/use-form-context'
import { Combobox } from '../combobox/combobox'
import { type Option } from '../combobox/options'
import { Field, FieldError, FieldLabel } from '../field/field'

type ValueOptions = number | string | undefined

interface ComboboxFieldProps<TValue extends ValueOptions> {
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  className?: string
  label?: string
  options: Option<TValue>[]
  placeholder?: string
  searchPlaceholder?: string
}

const ComboboxField = <TValue extends ValueOptions>({
  addNew,
  disabled,
  className,
  label,
  options,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
}: ComboboxFieldProps<TValue>) => {
  const field = useFieldContext<TValue | undefined>()

  const handleSelect = (option: Option<TValue> | null) => {
    if (option === null || option.value === field.store.state.value || option.value === undefined) {
      field.setValue(undefined)
    } else {
      field.setValue(option.value)
    }
  }

  return (
    <Field
      className={className}
      dirty={field.state.meta.isDirty}
      invalid={!field.state.meta.isValid}
      name={field.name}
      touched={field.state.meta.isTouched}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <Combobox
        addNew={addNew}
        disabled={disabled}
        isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
        onChange={handleSelect}
        options={options}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        title={label ?? placeholder}
        value={field.store.state.value}
      />
      <FieldError />
    </Field>
  )
}

export { ComboboxField }
