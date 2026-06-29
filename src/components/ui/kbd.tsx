import { cn } from '@/utils/cn'

export const Kbd = ({ className, ...props }: React.ComponentProps<'kbd'>): React.ReactElement => (
  <kbd
    className={cn(
      "pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded bg-secondary px-1 font-medium font-sans text-secondary-foreground text-xs [&_svg:not([class*='size-'])]:size-3",
      className
    )}
    data-slot="kbd"
    {...props}
  />
)

export const KbdGroup = ({ className, ...props }: React.ComponentProps<'kbd'>): React.ReactElement => (
  <kbd className={cn('inline-flex items-center gap-1', className)} data-slot="kbd-group" {...props} />
)
