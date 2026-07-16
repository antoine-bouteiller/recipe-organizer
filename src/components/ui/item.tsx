import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentProps, type JSX, Show, splitProps } from 'solid-js'

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
    group/item flex flex-wrap items-center gap-4 rounded-md border border-transparent p-4
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
        default: 'bg-transparent',
        outline: 'border-border',
      },
    },
  }
)

interface ItemProps {
  media?: JSX.Element
  title?: JSX.Element
  children?: JSX.Element
  actions?: JSX.Element
  variant?: VariantProps<typeof itemVariants>['variant']
  class?: string
}

const itemMediaClass = `
  flex shrink-0 items-center justify-center gap-2 bg-transparent
  group-has-data-[slot=item-description]/item:translate-y-0.5
  group-has-data-[slot=item-description]/item:self-start
  [&_svg]:pointer-events-none
`

export const Item = (props: ItemProps) => {
  const hasContent = () => props.title !== undefined || props.children !== undefined

  return (
    <div class={cn(itemVariants({ variant: props.variant ?? 'default' }), props.class)} data-slot="item">
      <Show when={props.media !== undefined}>
        <div class={itemMediaClass} data-slot="item-media">
          {props.media}
        </div>
      </Show>
      <Show when={hasContent()}>
        <div class="flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none" data-slot="item-content">
          <Show when={props.title !== undefined}>
            <div class="flex w-fit items-center gap-2 text-sm leading-snug font-medium" data-slot="item-title">
              {props.title}
            </div>
          </Show>
          <Show when={props.children !== undefined}>
            <p
              class="not-prose flex items-center gap-1 text-sm leading-normal font-normal text-balance text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary"
              data-slot="item-description"
            >
              {props.children}
            </p>
          </Show>
        </div>
      </Show>
      <Show when={props.actions !== undefined}>
        <div class="flex items-center gap-2" data-slot="item-actions">
          {props.actions}
        </div>
      </Show>
    </div>
  )
}
