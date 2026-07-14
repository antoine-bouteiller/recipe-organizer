import { Polymorphic, type PolymorphicProps } from '@kobalte/core/polymorphic'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentProps, type JSX, Show, splitProps, type ValidComponent } from 'solid-js'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/cn'

export const ItemGroup = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <div class={cn('group/item-group flex flex-col', local.class)} data-slot="item-group" role="list" {...rest} />
}

export const ItemSeparator = (props: ComponentProps<typeof Separator>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <Separator class={cn('my-0', local.class)} data-slot="item-separator" orientation="horizontal" {...rest} />
}

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
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'gap-4 p-4',
        sm: 'gap-2.5 px-4 py-3',
      },
      variant: {
        default: 'bg-transparent',
        muted: 'bg-muted/50',
        outline: 'border-border',
      },
    },
  }
)

type ItemRootOptions = VariantProps<typeof itemVariants> & { class?: string }
type ItemRootProps<T extends ValidComponent = 'div'> = PolymorphicProps<T, ItemRootOptions>

const ItemRoot = <T extends ValidComponent = 'div'>(props: ItemRootProps<T>) => {
  const [local, rest] = splitProps(props as ItemRootProps, ['class', 'size', 'variant', 'as'])
  const size = () => local.size ?? 'default'
  const variant = () => local.variant ?? 'default'
  return (
    <Polymorphic
      as={(local.as ?? 'div') as ValidComponent}
      class={cn(itemVariants({ size: size(), variant: variant() }), local.class)}
      data-size={size()}
      data-slot="item"
      data-variant={variant()}
      {...rest}
    />
  )
}

const itemMediaVariants = cva(
  `
    flex shrink-0 items-center justify-center gap-2
    group-has-data-[slot=item-description]/item:translate-y-0.5
    group-has-data-[slot=item-description]/item:self-start
    [&_svg]:pointer-events-none
  `,
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: `
          size-8 rounded-sm border bg-muted
          [&_svg:not([class*='size-'])]:size-4
        `,
        image: `
          size-10 overflow-hidden rounded-sm
          [&_img]:size-full [&_img]:object-cover
        `,
      },
    },
  }
)

const ItemMedia = (props: ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>) => {
  const [local, rest] = splitProps(props, ['class', 'variant'])
  const variant = () => local.variant ?? 'default'
  return <div class={cn(itemMediaVariants({ variant: variant() }), local.class)} data-slot="item-media" data-variant={variant()} {...rest} />
}

const ItemContent = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <div class={cn('flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none', local.class)} data-slot="item-content" {...rest} />
}

const ItemTitle = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <div class={cn('flex w-fit items-center gap-2 text-sm leading-snug font-medium', local.class)} data-slot="item-title" {...rest} />
}

const ItemDescription = (props: ComponentProps<'p'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <p
      class={cn(
        'not-prose flex items-center gap-1 text-sm leading-normal font-normal text-balance text-muted-foreground',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        local.class
      )}
      data-slot="item-description"
      {...rest}
    />
  )
}

const ItemActions = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <div class={cn('flex items-center gap-2', local.class)} data-slot="item-actions" {...rest} />
}

interface ItemProps {
  media?: JSX.Element
  title?: JSX.Element
  children?: JSX.Element
  actions?: JSX.Element
  variant?: ItemRootOptions['variant']
  size?: ItemRootOptions['size']
  class?: string
  as?: ValidComponent
  onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
}

export const Item = (props: ItemProps) => {
  const hasContent = () => props.title !== undefined || props.children !== undefined

  return (
    <ItemRoot as={props.as} class={props.class} onClick={props.onClick} size={props.size} variant={props.variant}>
      <Show when={props.media !== undefined}>
        <ItemMedia>{props.media}</ItemMedia>
      </Show>
      <Show when={hasContent()}>
        <ItemContent>
          <Show when={props.title !== undefined}>
            <ItemTitle>{props.title}</ItemTitle>
          </Show>
          <Show when={props.children !== undefined}>
            <ItemDescription>{props.children}</ItemDescription>
          </Show>
        </ItemContent>
      </Show>
      <Show when={props.actions !== undefined}>
        <ItemActions>{props.actions}</ItemActions>
      </Show>
    </ItemRoot>
  )
}
