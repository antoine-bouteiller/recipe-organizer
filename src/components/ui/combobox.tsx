import { createMemo, type JSX, lazy, Show, Suspense } from 'solid-js'

import { useIsMobile } from '@/hooks/use-is-mobile'
import { type Option } from '@/hooks/use-options'

export type ValueOptions = number | string | undefined

export interface ComboboxImplProps<TValue extends ValueOptions> {
  addNew?: (inputValue: string) => JSX.Element
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
  addNew?: (inputValue: string) => JSX.Element
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

const ComboboxFallback = () => <div aria-hidden="true" class="h-9 w-full rounded-lg border border-input bg-background" />

const Combobox = <TValue extends ValueOptions>(props: ComboboxProps<TValue>) => {
  const isMobile = useIsMobile()
  const selectedOption = createMemo(() => props.options.find((option) => option.value === props.value))

  const implProps = () => ({
    addNew: props.addNew,
    disabled: props.disabled,
    isInvalid: props.isInvalid ?? false,
    onChange: props.onChange,
    options: props.options,
    placeholder: props.placeholder ?? 'Sélectionner une option',
    searchPlaceholder: props.searchPlaceholder ?? 'Rechercher une option',
    selectedOption: selectedOption(),
    title: props.title ?? props.placeholder ?? 'Sélectionner une option',
  })

  return (
    <Suspense fallback={<ComboboxFallback />}>
      <Show when={isMobile()} fallback={<ComboboxBase {...implProps()} />}>
        <ComboboxDrawer {...implProps()} />
      </Show>
    </Suspense>
  )
}

export { Combobox }
