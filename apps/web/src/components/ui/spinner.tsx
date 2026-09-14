import { CircleNotchIcon } from '@client/components/icons/circle-notch'
import { cn } from 'cn'
import type React from 'react'

export const Spinner = ({ className, ...props }: React.ComponentProps<typeof CircleNotchIcon>): React.ReactElement => (
  <CircleNotchIcon aria-label="Loading" className={cn('animate-spin', className)} role="status" {...props} />
)
