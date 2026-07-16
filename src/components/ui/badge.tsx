import { Polymorphic, type PolymorphicProps } from '@kobalte/core/polymorphic'
import { cva, type VariantProps } from 'class-variance-authority'
import { splitProps, type ValidComponent } from 'solid-js'

import { cn } from '@/utils/cn'

const badgeVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-sm border border-transparent font-medium outline-none transition-shadow h-5.5 min-w-5.5 px-[calc(--spacing(1)-1px)] text-sm sm:h-4.5 sm:min-w-4.5 sm:text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-3.5 sm:[&_svg:not([class*='size-'])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [button&,a&]:cursor-pointer [button&,a&]:pointer-coarse:after:absolute [button&,a&]:pointer-coarse:after:size-full [button&,a&]:pointer-coarse:after:min-h-11 [button&,a&]:pointer-coarse:after:min-w-11",
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [button&,a&]:hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground [button&,a&]:hover:bg-secondary/90',
      },
    },
  }
)

interface BadgeOptions {
  variant?: VariantProps<typeof badgeVariants>['variant']
  class?: string
}

type BadgeProps<T extends ValidComponent = 'span'> = PolymorphicProps<T, BadgeOptions>

export const Badge = <T extends ValidComponent = 'span'>(props: BadgeProps<T>) => {
  const [local, rest] = splitProps(props as BadgeProps, ['variant', 'class', 'as'])

  return (
    <Polymorphic
      as={(local.as ?? 'span') as ValidComponent}
      class={cn(badgeVariants({ variant: local.variant }), local.class)}
      data-slot="badge"
      {...rest}
    />
  )
}
