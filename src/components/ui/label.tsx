import { type ComponentProps, splitProps } from 'solid-js'

import { cn } from '@/utils/cn'

export const Label = (props: ComponentProps<'label'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <label
      class={cn('inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4', local.class)}
      data-slot="label"
      {...rest}
    />
  )
}
