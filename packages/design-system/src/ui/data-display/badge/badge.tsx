import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { type ComponentProps, type ReactElement } from 'react'

const badgeVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-sm border border-transparent font-medium outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-3.5 sm:[&_svg:not([class*='size-'])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-5.5 min-w-5.5 px-[calc(--spacing(1)-1px)] text-sm sm:h-4.5 sm:min-w-4.5 sm:text-xs',
        sm: 'h-5 min-w-5 rounded-[.25rem] px-[calc(--spacing(1)-1px)] text-xs sm:h-4 sm:min-w-4 sm:text-[.625rem]',
      },
      variant: {
        accent: 'rounded-full bg-accent font-semibold text-accent-foreground',
        default: 'bg-primary text-primary-foreground',
        eyebrow: 'rounded-full bg-secondary font-medium tracking-[0.12em] text-secondary-foreground uppercase',
        overlay: 'rounded-full bg-white/20 font-semibold text-white backdrop-blur-sm',
        secondary: 'bg-secondary text-secondary-foreground',
      },
    },
  }
)

export interface BadgeProps extends ComponentProps<'span'> {
  variant?: VariantProps<typeof badgeVariants>['variant']
  size?: VariantProps<typeof badgeVariants>['size']
}

export const Badge = ({ className, variant, size, ...props }: BadgeProps): ReactElement => (
  <span className={cn(badgeVariants({ className, size, variant }))} data-slot="badge" {...props} />
)
