import { Separator as SeparatorPrimitive } from '@base-ui-components/react/separator'
import * as React from 'react'

import { cn } from '@/utils/cn'

const Separator = ({ className, ...props }: React.ComponentProps<typeof SeparatorPrimitive>) => (
  <SeparatorPrimitive
    data-slot="separator"
    className={cn(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      className
    )}
    {...props}
  />
)

Separator.displayName = SeparatorPrimitive.displayName

export { Separator }
