import { type ComponentProps, onMount, splitProps } from 'solid-js'

import { cn } from '@/utils/cn'

const focusableButtons = (root: HTMLElement): HTMLElement[] => [...root.querySelectorAll<HTMLElement>('button:not([disabled])')]

export const Toolbar = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  let ref: HTMLDivElement | undefined = undefined

  onMount(() => {
    if (!ref) {
      return
    }
    const buttons = focusableButtons(ref)
    for (const [index, button] of buttons.entries()) {
      button.tabIndex = index === 0 ? 0 : -1
    }
  })

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!ref) {
      return
    }
    const steps: Record<string, number> = { ArrowDown: 1, ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1 }
    const buttons = focusableButtons(ref)
    if (buttons.length === 0) {
      return
    }
    const step = steps[event.key]
    const current = buttons.indexOf(document.activeElement as HTMLElement)
    let next = current
    if (step !== undefined) {
      next = (current + step + buttons.length) % buttons.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = buttons.length - 1
    } else {
      return
    }
    event.preventDefault()
    buttons[next]?.focus()
  }

  const handleFocusIn = (event: FocusEvent) => {
    if (!ref) {
      return
    }
    for (const button of focusableButtons(ref)) {
      button.tabIndex = button === event.target ? 0 : -1
    }
  }

  return (
    <div
      class={cn('relative flex w-full gap-2 overflow-auto rounded-xl border bg-card p-1 text-card-foreground not-dark:bg-clip-padding', local.class)}
      data-slot="toolbar"
      onFocusIn={handleFocusIn}
      onKeyDown={handleKeyDown}
      ref={(el) => (ref = el)}
      role="toolbar"
      {...rest}
    />
  )
}

export const ToolbarGroup = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <div class={cn('flex items-center gap-1', local.class)} data-slot="toolbar-group" role="group" {...rest} />
}

export const ToolbarSeparator = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div
      aria-orientation="vertical"
      class={cn('my-1.5 w-px shrink-0 self-stretch bg-border', local.class)}
      data-slot="toolbar-separator"
      role="separator"
      {...rest}
    />
  )
}
