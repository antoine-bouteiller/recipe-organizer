import { CircleNotchIcon } from '@phosphor-icons/react'
import type React from 'react'

import { cn } from '@/utils/cn'

export const Spinner = ({ className, ...props }: React.ComponentProps<typeof CircleNotchIcon>): React.ReactElement => (
  <CircleNotchIcon aria-label="Loading" className={cn('animate-spin', className)} role="status" {...props} />
)
