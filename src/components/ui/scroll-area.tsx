import { type ComponentProps, createSignal, splitProps } from 'solid-js'

import { cn } from '@/utils/cn'

type ScrollAreaProps = ComponentProps<'div'> & {
  scrollFade?: boolean
  scrollbarGutter?: boolean
}

export const ScrollArea = (props: ScrollAreaProps) => {
  const [local, rest] = splitProps(props, ['class', 'children', 'scrollFade', 'scrollbarGutter'])
  const [atStart, setAtStart] = createSignal(true)
  const [atEnd, setAtEnd] = createSignal(true)

  const onScroll = (event: Event & { currentTarget: HTMLDivElement }) => {
    const el = event.currentTarget
    setAtStart(el.scrollTop <= 0)
    setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 1)
  }

  return (
    <div
      class={cn(
        'size-full min-h-0 overflow-y-auto overscroll-y-contain outline-none [scrollbar-width:thin]',
        local.scrollbarGutter && '[scrollbar-gutter:stable]',
        local.scrollFade && '[--fade-size:1.5rem]',
        local.scrollFade && !atStart() && 'mask-t-from-[calc(100%-var(--fade-size))]',
        local.scrollFade && !atEnd() && 'mask-b-from-[calc(100%-var(--fade-size))]',
        local.class
      )}
      data-slot="scroll-area-viewport"
      onScroll={local.scrollFade ? onScroll : undefined}
      {...rest}
    >
      {local.children}
    </div>
  )
}
