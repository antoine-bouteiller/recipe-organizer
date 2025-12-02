import { Checkbox as CheckboxPrimitive } from '@base-ui-components/react/checkbox'
import { CheckIcon } from '@phosphor-icons/react'
import * as React from 'react'

import { cn } from '@/utils/cn'

const Checkbox = ({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) => (
  <CheckboxPrimitive.Root
    className={cn(
      `
        peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs
        transition-shadow outline-none
        focus-visible:border-ring focus-visible:ring-[3px]
        focus-visible:ring-ring/50
        disabled:cursor-not-allowed disabled:opacity-50
        aria-invalid:border-destructive aria-invalid:ring-destructive/20
        data-[checked]:border-primary data-[checked]:bg-primary
        data-[checked]:text-primary-foreground
        dark:bg-input/30 dark:aria-invalid:ring-destructive/40
        dark:data-[checked]:bg-primary
      `,
      className
    )}
    data-slot="checkbox"
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current transition-none" data-slot="checkbox-indicator">
      <CheckIcon className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)

export { Checkbox }
