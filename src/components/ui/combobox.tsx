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

  const Impl = (isMobile ? ComboboxDrawer : ComboboxBase) as unknown as (props: ComboboxImplProps<TValue>) => ReactElement

  return (
    <Suspense fallback={<ComboboxFallback />}>
      <Impl
        addNew={addNew}
        disabled={disabled}
        isInvalid={isInvalid}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        selectedOption={selectedOption}
        title={title ?? placeholder}
      />
    </Suspense>
  )
}

export { Combobox }
