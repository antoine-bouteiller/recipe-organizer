import { type IconProps, SpinnerGap } from 'phosphor-solid'
import { splitProps } from 'solid-js'

import { cn } from '@/utils/cn'

export const Spinner = (props: IconProps) => {
  const [local, rest] = splitProps(props, ['class'])
  return <SpinnerGap aria-label="Loading" class={cn('animate-spin', local.class)} role="status" {...rest} />
}
