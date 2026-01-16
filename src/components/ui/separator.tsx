import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import * as React from 'react'

import { cn } from '@/utils/cn'

const Separator = ({ className, ...props }: React.ComponentProps<typeof SeparatorPrimitive>) => (
  <SeparatorPrimitive
    className={cn(
      `shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px`,
      className
    )}
    data-slot="separator"
    {...props}
  />
)

Separator.displayName = SeparatorPrimitive.displayName

export { Separator }
