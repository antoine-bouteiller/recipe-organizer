import { CircleNotchIcon } from '@phosphor-icons/react'

import { cn } from '@/utils/cn'

const Spinner = ({ className, ...props }: React.ComponentProps<'svg'>) => (
  <CircleNotchIcon aria-label="Loading" className={cn('size-4 animate-spin', className)} role="status" {...props} />
)

export { Spinner }
