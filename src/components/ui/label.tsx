import * as React from 'react'

import { cn } from '@/utils/cn'

const Label = ({ className, htmlFor, ...props }: React.ComponentProps<'label'>) => (
  <label className={cn('inline-flex items-center gap-2 text-sm/4', className)} data-slot="label" htmlFor={htmlFor} {...props} />
)

export { Label }
