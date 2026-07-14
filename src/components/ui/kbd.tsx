import { type ComponentProps, splitProps } from 'solid-js'

import { cn } from '@/utils/cn'

export const Kbd = (props: ComponentProps<'kbd'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <kbd
      class={cn(
        "pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded bg-secondary px-1 font-medium font-sans text-secondary-foreground text-xs [&_svg:not([class*='size-'])]:size-3",
        local.class
      )}
      data-slot="kbd"
      {...rest}
    />
  )
}

export const KbdGroup = (props: ComponentProps<'kbd'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <kbd class={cn('inline-flex items-center gap-1', local.class)} data-slot="kbd-group" {...rest} />
}
