import { CircleNotchIcon } from '@phosphor-icons/react'

import { cn } from '@/lib/utils'

const Spinner = ({ className, ...props }: React.ComponentProps<'svg'>) => (
  <CircleNotchIcon
    role="status"
    aria-label="Loading"
    className={cn('size-4 animate-spin', className)}
    {...props}
  />
)

export { Spinner }
