import { CircleNotchIcon } from '@phosphor-icons/react'

import { cn } from '@/utils/cn'

const Spinner = ({ className, ...props }: React.ComponentProps<typeof CircleNotchIcon>) => (
  <CircleNotchIcon aria-label="Loading" className={cn('animate-spin', className)} role="status" {...props} />
)

export { Spinner }
