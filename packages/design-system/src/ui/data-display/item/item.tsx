import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { type ComponentProps, type ReactElement, type ReactNode } from 'react'

import { Separator } from '../../layout/separator/separator'

export const ItemGroup = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('group/item-group flex flex-col', className)} data-slot="item-group" role="list" {...props} />
)

export const ItemSeparator = ({ className, ...props }: ComponentProps<typeof Separator>) => (
  <Separator className={cn('my-0', className)} data-slot="item-separator" orientation="horizontal" {...props} />
)

const itemVariants = cva(
  `
    group/item flex flex-wrap items-center rounded-md border border-transparent
    text-sm transition-colors duration-100 outline-none
    focus-visible:border-ring focus-visible:ring-[3px]
    focus-visible:ring-ring/50
    [a]:transition-colors [a]:hover:bg-accent/50
  `,
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'gap-4 bg-transparent p-4',
        outline: 'gap-4 border-border p-4',
      },
    },
  }
)

const ItemRoot = ({ className, variant = 'default', ...props }: ComponentProps<'div'> & VariantProps<typeof itemVariants>) => (
  <div className={cn(itemVariants({ className, variant }))} data-slot="item" data-variant={variant} {...props} />
)

const ItemMedia = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    className={cn(
      'flex shrink-0 items-center justify-center gap-2 bg-transparent group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none',
      className
    )}
    data-slot="item-media"
    {...props}
  />
)

const ItemContent = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn(`flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none`, className)} data-slot="item-content" {...props} />
)

const ItemTitle = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn(`flex w-fit items-center gap-2 text-sm leading-snug font-medium`, className)} data-slot="item-title" {...props} />
)

const ItemDescription = ({ className, ...props }: ComponentProps<'p'>) => (
  <p
    className={cn(
      `not-prose flex items-center gap-1 text-sm leading-normal font-normal text-balance text-muted-foreground`,
      `[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary`,
      className
    )}
    data-slot="item-description"
    {...props}
  />
)

const ItemActions = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('flex items-center gap-2', className)} data-slot="item-actions" {...props} />
)

type ItemRootProps = ComponentProps<typeof ItemRoot>

interface ItemProps {
  media?: ReactNode
  title?: ReactNode
  children?: ReactNode
  actions?: ReactNode
  variant?: ItemRootProps['variant']
  className?: string
}

export const Item = ({ media, title, children, actions, variant, className }: ItemProps): ReactElement => {
  const hasContent = title !== undefined || children !== undefined

  return (
    <ItemRoot className={className} variant={variant}>
      {media !== undefined && <ItemMedia>{media}</ItemMedia>}
      {hasContent && (
        <ItemContent>
          {title !== undefined && <ItemTitle>{title}</ItemTitle>}
          {children !== undefined && <ItemDescription>{children}</ItemDescription>}
        </ItemContent>
      )}
      {actions !== undefined && <ItemActions>{actions}</ItemActions>}
    </ItemRoot>
  )
}
