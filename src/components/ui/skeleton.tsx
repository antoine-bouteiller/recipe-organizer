import { type ComponentProps, splitProps } from 'solid-js'

import { cn } from '@/utils/cn'

export const Skeleton = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div
      class={cn(
        'animate-skeleton rounded-sm [--skeleton-highlight:--alpha(var(--color-white)/64%)] [background:linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)_var(--color-muted)_0_0/200%_100%_fixed] dark:[--skeleton-highlight:--alpha(var(--color-white)/4%)]',
        local.class
      )}
      data-slot="skeleton"
      {...rest}
    />
  )
}
