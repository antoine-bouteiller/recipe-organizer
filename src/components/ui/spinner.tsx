import { CircleNotchIcon } from '@phosphor-icons/react'

import { cn } from '@/utils/cn'

const Spinner = ({ className, ...props }: React.ComponentProps<'svg'>) => (
  <CircleNotchIcon
    role="status"
    aria-label="Loading"
    className={cn('size-4 animate-spin', className)}
    {...props}
  />
)

export { Spinner }
