import { type ComponentProps, splitProps } from 'solid-js'
import SpinnerGap from '~icons/ph/spinner-gap'

import { cn } from '@/utils/cn'

export const Spinner = (props: ComponentProps<'svg'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <SpinnerGap aria-label="Loading" class={cn('animate-spin', local.class)} role="status" {...rest} />
}
