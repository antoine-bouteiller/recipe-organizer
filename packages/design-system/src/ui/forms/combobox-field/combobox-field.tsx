import { useFieldContext } from '@design-system/hooks/use-form-context'
import { useIsMobile } from '@design-system/hooks/use-is-mobile'
import { lazy, Suspense } from 'react'
import type { ReactElement, ReactNode } from 'react'

import { Field, FieldError, FieldLabel } from '../field/field'
import type { Option } from './options'

import * as styles from './combobox-field.css'

export type ValueOptions = number | string | undefined

export interface ComboboxImplProps<TValue extends ValueOptions> {
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  isInvalid: boolean
  onChange: (option: Option<TValue> | null) => void
  options: Option<TValue>[]
  placeholder: string
  searchPlaceholder: string
  selectedOption: Option<TValue> | undefined
  title: string
}

interface ComboboxFieldProps<TValue extends ValueOptions> {
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  label?: string
  options: Option<TValue>[]
  placeholder?: string
  searchPlaceholder?: string
}

const ComboboxBase = lazy(() => import('./combobox.base'))
const ComboboxDrawer = lazy(() => import('./combobox.drawer'))

const ComboboxField = <TValue extends ValueOptions>({
  addNew,
  disabled,
  label,
  options,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
}: ComboboxFieldProps<TValue>): ReactElement => {
  const field = useFieldContext<TValue | undefined>()
  const isMobile = useIsMobile()
  const { value } = field.store.state
  const selectedOption = options.find((opt) => opt.value === value)

  const handleSelect = (option: Option<TValue> | null) => {
    if (option === null || option.value === value || option.value === undefined) {
      field.setValue(undefined)
    } else {
      field.setValue(option.value)
    }
  }

  // Lazy boundaries erase the generic, so impls emit widened options: look the original typed option back up.
  const implProps: ComboboxImplProps<ValueOptions> = {
    addNew,
    disabled,
    isInvalid: field.state.meta.isTouched && !field.state.meta.isValid,
    onChange: (option) => handleSelect(options.find((opt) => opt.value === option?.value) ?? null),
    options,
    placeholder,
    searchPlaceholder,
    selectedOption,
    title: label ?? placeholder,
  }

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Suspense fallback={<div aria-hidden="true" className={styles.fallback} />}>
        {isMobile ? <ComboboxDrawer {...implProps} /> : <ComboboxBase {...implProps} />}
      </Suspense>
      <FieldError />
    </Field>
  )
}

export { ComboboxField }
