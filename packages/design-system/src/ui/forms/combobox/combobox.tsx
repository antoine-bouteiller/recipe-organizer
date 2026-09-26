import { useIsMobile } from '@design-system/hooks/use-is-mobile'
import { lazy, Suspense } from 'react'
import type { ReactElement, ReactNode } from 'react'

import type { Option } from './options'

import * as styles from './combobox.css'

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

interface ComboboxProps<TValue extends ValueOptions> {
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  isInvalid?: boolean
  onChange: (option: Option<TValue> | null) => void
  options: Option<TValue>[]
  placeholder?: string
  searchPlaceholder?: string
  title?: string
  value: TValue | undefined
}

const ComboboxBase = lazy(() => import('./combobox.base'))
const ComboboxDrawer = lazy(() => import('./combobox.drawer'))

const Combobox = <TValue extends ValueOptions>({
  addNew,
  disabled,
  isInvalid = false,
  onChange,
  options,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
  title,
  value,
}: ComboboxProps<TValue>): ReactElement => {
  const isMobile = useIsMobile()
  const selectedOption = options.find((opt) => opt.value === value)

  // Lazy boundaries erase the generic, so impls emit widened options: look the original typed option back up.
  const implProps: ComboboxImplProps<ValueOptions> = {
    addNew,
    disabled,
    isInvalid,
    onChange: (option) => onChange(options.find((opt) => opt.value === option?.value) ?? null),
    options,
    placeholder,
    searchPlaceholder,
    selectedOption,
    title: title ?? placeholder,
  }

  return (
    <Suspense fallback={<div aria-hidden="true" className={styles.fallback} />}>
      {isMobile ? <ComboboxDrawer {...implProps} /> : <ComboboxBase {...implProps} />}
    </Suspense>
  )
}

export { Combobox }
