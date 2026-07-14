import { Polymorphic, type PolymorphicProps } from '@kobalte/core/polymorphic'
import { splitProps, type ValidComponent } from 'solid-js'

import { cn } from '@/utils/cn'

export type LabelProps<T extends ValidComponent = 'label'> = PolymorphicProps<T, { class?: string }>

export const Label = <T extends ValidComponent = 'label'>(props: LabelProps<T>) => {
  const [local, rest] = splitProps(props as LabelProps, ['class', 'as'])
  return (
    <Polymorphic
      as={(local.as ?? 'label') as ValidComponent}
      class={cn('inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4', local.class)}
      data-slot="label"
      {...rest}
    />
  )
}
