import { type ComponentProps, createSignal, onMount, splitProps } from 'solid-js'

import { cn } from '@/utils/cn'

type ScrollAreaProps = ComponentProps<'div'> & {
  scrollFade?: boolean
}

export const ScrollArea = (props: ScrollAreaProps) => {
  const [local, rest] = splitProps(props, ['class', 'children', 'scrollFade'])
  const [atStart, setAtStart] = createSignal(true)
  const [atEnd, setAtEnd] = createSignal(true)

  let viewport: HTMLDivElement | undefined = undefined
  const measure = () => {
    if (!viewport) {
      return
    }
    setAtStart(viewport.scrollTop <= 0)
    setAtEnd(viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 1)
  }

  onMount(() => local.scrollFade && measure())

  return (
    <div
      ref={(el) => (viewport = el)}
      class={cn(
        'size-full min-h-0 overflow-y-auto overscroll-y-contain outline-none [scrollbar-width:thin]',
        local.scrollFade && '[--fade-size:1.5rem]',
        local.scrollFade && !atStart() && 'mask-t-from-[calc(100%-var(--fade-size))]',
        local.scrollFade && !atEnd() && 'mask-b-from-[calc(100%-var(--fade-size))]',
        local.class
      )}
      data-slot="scroll-area-viewport"
      onScroll={local.scrollFade ? measure : undefined}
      {...rest}
    >
      {local.children}
    </div>
  )
}
