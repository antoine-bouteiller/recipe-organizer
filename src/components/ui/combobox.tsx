import { lazy, Suspense, useMemo, type ReactElement, type ReactNode } from 'react'

import { useIsMobile } from '@/hooks/use-is-mobile'
import { type Option } from '@/hooks/use-options'

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

const ComboboxBase = lazy(() => import('@/components/ui/combobox.base'))
const ComboboxDrawer = lazy(() => import('@/components/ui/combobox.drawer'))

const ComboboxFallback = (): ReactElement => <div aria-hidden="true" className="h-9 w-full rounded-lg border border-input bg-background" />

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
  const selectedOption = useMemo(() => options.find((opt) => opt.value === value), [options, value])

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

  return <Suspense fallback={<ComboboxFallback />}>{isMobile ? <ComboboxDrawer {...implProps} /> : <ComboboxBase {...implProps} />}</Suspense>
}

export { Combobox }
