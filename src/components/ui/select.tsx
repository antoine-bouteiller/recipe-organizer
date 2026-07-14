import { lazy, Show, Suspense } from 'solid-js'

import { type SelectButtonProps } from '@/components/ui/select.shared'
import { useIsMobile } from '@/hooks/use-is-mobile'

interface SelectOption<TValue extends string> {
  label: string
  value: TValue | null
}

interface SelectBaseProps<TValue extends string> {
  items: SelectOption<TValue>[]
  placeholder?: string
  title?: string
  disabled?: boolean
  class?: string
  size?: SelectButtonProps['size']
}

export type SelectProps<TValue extends string> = SelectBaseProps<TValue> &
  (
    | { multiple?: false; value: TValue | null | undefined; onValueChange: (value: TValue | null) => void }
    | { multiple: true; value: TValue[]; onValueChange: (value: TValue[]) => void }
  )

const SelectBase = lazy(() => import('@/components/ui/select.base'))
const SelectDrawer = lazy(() => import('@/components/ui/select.drawer'))

export const Select = <TValue extends string>(props: SelectProps<TValue>) => {
  const isMobile = useIsMobile()

  return (
    <Suspense>
      <Show when={isMobile()} fallback={<SelectBase {...props} />}>
        <SelectDrawer {...props} />
      </Show>
    </Suspense>
  )
}
