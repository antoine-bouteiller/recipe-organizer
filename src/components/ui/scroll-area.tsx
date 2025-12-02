import { ScrollArea as ScrollAreaPrimitive } from '@base-ui-components/react/scroll-area'
import * as React from 'react'

import { cn } from '@/utils/cn'

const ScrollArea = ({ children, className, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) => (
  <ScrollAreaPrimitive.Root className={cn('relative', className)} data-slot="scroll-area" {...props}>
    <ScrollAreaPrimitive.Viewport
      className={`
        size-full rounded-[inherit] transition-[color,box-shadow] outline-none
        focus-visible:ring-[3px] focus-visible:ring-ring/50
        focus-visible:outline-1
      `}
      data-slot="scroll-area-viewport"
    >
      <ScrollAreaPrimitive.Content>{children}</ScrollAreaPrimitive.Content>
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
)

const ScrollBar = ({ className, orientation = 'vertical', ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>) => (
  <ScrollAreaPrimitive.Scrollbar
    className={cn(
      `
        flex touch-none p-px opacity-0 transition-[colors,opacity] delay-300
        duration-150 select-none
        data-hovering:opacity-100 data-hovering:delay-0
        data-hovering:duration-75
        data-scrolling:opacity-100 data-scrolling:delay-0
        data-scrolling:duration-75
      `,
      orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent',
      orientation === 'horizontal' &&
        `
        h-2.5 flex-col border-t border-t-transparent
      `,
      className
    )}
    data-slot="scroll-area-scrollbar"
    orientation={orientation}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" data-slot="scroll-area-thumb" />
  </ScrollAreaPrimitive.Scrollbar>
)

export { ScrollArea, ScrollBar }
