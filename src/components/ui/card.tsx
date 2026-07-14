import { type JSX, Show } from 'solid-js'

import { cn } from '@/utils/cn'

interface CardProps {
  title?: JSX.Element
  description?: JSX.Element
  class?: string
  children?: JSX.Element
}

export const Card = (props: CardProps) => {
  const hasHeader = () => props.title !== undefined || props.description !== undefined

  return (
    <div
      class={cn('relative flex flex-col rounded-2xl border bg-card text-card-foreground shadow-xs/5 not-dark:bg-clip-padding', props.class)}
      data-slot="card"
    >
      <Show when={hasHeader()}>
        <div class="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-6" data-slot="card-header">
          <Show when={props.title !== undefined}>
            <div class="text-lg leading-none font-semibold" data-slot="card-title">
              {props.title}
            </div>
          </Show>
          <Show when={props.description !== undefined}>
            <div class="text-sm text-muted-foreground" data-slot="card-description">
              {props.description}
            </div>
          </Show>
        </div>
      </Show>
      {props.children}
    </div>
  )
}
