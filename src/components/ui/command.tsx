import { Dialog as DialogPrimitive } from '@kobalte/core/dialog'
import { MagnifyingGlass } from 'phosphor-solid'
import {
  type ComponentProps,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  type JSX,
  onCleanup,
  Show,
  splitProps,
  useContext,
} from 'solid-js'

import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

interface CommandItemEntry {
  id: string
  select: () => void
  value: string
}

interface CommandContextValue {
  activeValue: () => string | undefined
  moveActive: (delta: number) => void
  query: () => string
  register: (entry: CommandItemEntry) => void
  selectActive: () => void
  setQuery: (value: string) => void
  visibleCount: () => number
}

const CommandContext = createContext<CommandContextValue>()

const useCommand = () => {
  const context = useContext(CommandContext)
  if (!context) {
    throw new Error('Command subcomponents must be used within <Command>')
  }
  return context
}

export const Command = <TItem,>(props: { items?: TItem[]; children: (item: TItem) => JSX.Element }) => {
  const [query, setQuery] = createSignal('')
  const [entries, setEntries] = createSignal<CommandItemEntry[]>([])
  const [activeIndex, setActiveIndex] = createSignal(0)

  const matches = (value: string) => value.toLowerCase().includes(query().toLowerCase())
  const visible = createMemo(() => entries().filter((entry) => matches(entry.value)))

  createEffect(() => {
    query()
    setActiveIndex(0)
  })

  const context: CommandContextValue = {
    activeValue: () => visible()[activeIndex()]?.value,
    moveActive: (delta) => setActiveIndex((index) => Math.max(0, Math.min(visible().length - 1, index + delta))),
    query,
    register: (entry) => {
      setEntries((current) => [...current, entry])
      onCleanup(() => setEntries((current) => current.filter((item) => item.id !== entry.id)))
    },
    selectActive: () => visible()[activeIndex()]?.select(),
    setQuery,
    visibleCount: () => visible().length,
  }

  return (
    <CommandContext.Provider value={context}>
      <For each={props.items}>{(item) => props.children(item)}</For>
    </CommandContext.Provider>
  )
}

export const CommandInput = (props: { placeholder?: string; class?: string }) => {
  const command = useCommand()

  return (
    <div class="flex items-center gap-2 px-2.5 py-1.5">
      <MagnifyingGlass class="size-4 shrink-0 opacity-60" />
      <Input
        autofocus
        class={cn('border-transparent! bg-transparent! shadow-none before:hidden has-focus-visible:ring-0', props.class)}
        onInput={(event) => command.setQuery(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            command.moveActive(1)
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            command.moveActive(-1)
          } else if (event.key === 'Enter') {
            event.preventDefault()
            command.selectActive()
          }
        }}
        placeholder={props.placeholder}
        size="lg"
        value={command.query()}
      />
    </div>
  )
}

export const CommandList = (props: { class?: string; children: JSX.Element }) => (
  <div class={cn('min-h-0 flex-1 overflow-y-auto scroll-py-2 p-2', props.class)} data-slot="command-list">
    {props.children}
  </div>
)

export const CommandEmpty = (props: { children: JSX.Element }) => {
  const command = useCommand()

  return (
    <Show when={command.visibleCount() === 0}>
      <div class="py-6 text-center text-base text-muted-foreground sm:text-sm" data-slot="command-empty">
        {props.children}
      </div>
    </Show>
  )
}

export const CommandItem = (props: { value: string; onClick?: () => void; children: JSX.Element }) => {
  const command = useCommand()
  const id = createUniqueId()

  command.register({ id, select: () => props.onClick?.(), value: props.value })

  const isActive = () => command.activeValue() === props.value
  const isVisible = () => props.value.toLowerCase().includes(command.query().toLowerCase())

  return (
    <Show when={isVisible()}>
      <button
        class={cn(
          'flex min-h-8 w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-base outline-none sm:min-h-7 sm:text-sm',
          isActive() && 'bg-accent text-accent-foreground'
        )}
        data-slot="command-item"
        onClick={() => props.onClick?.()}
        type="button"
      >
        {props.children}
      </button>
    </Show>
  )
}

export const CommandPanel = (props: ComponentProps<'div'>) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <div
      class="relative -mx-px flex min-h-0 flex-col rounded-t-xl border border-b-0 bg-popover bg-clip-padding shadow-xs/5 not-has-[+[data-slot=command-footer]]:-mb-px not-has-[+[data-slot=command-footer]]:rounded-b-2xl"
      {...rest}
    />
  )
}

export const CommandFooter = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div
      class={cn('relative flex items-center justify-between gap-2 rounded-b-2xl border-t px-5 py-3 text-muted-foreground text-xs', local.class)}
      data-slot="command-footer"
      {...rest}
    />
  )
}

export const CommandDialog = (props: ComponentProps<typeof DialogPrimitive>) => <DialogPrimitive {...props} />

export const CommandDialogTrigger = (props: ComponentProps<typeof DialogPrimitive.Trigger>) => (
  <DialogPrimitive.Trigger data-slot="command-dialog-trigger" {...props} />
)

export const CommandDialogPopup = (props: { children: JSX.Element }) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      class="fixed inset-0 z-50 bg-black/32 backdrop-blur-sm data-closed:animate-out data-closed:fade-out-0 data-expanded:animate-in data-expanded:fade-in-0"
      data-slot="command-dialog-backdrop"
    />
    <div class="fixed inset-0 z-50 flex flex-col items-center px-4 py-[max(--spacing(4),4vh)] sm:py-[10vh]" data-slot="command-dialog-viewport">
      <DialogPrimitive.Content
        class="relative flex max-h-105 min-h-0 w-full max-w-xl min-w-0 flex-col rounded-2xl border bg-popover text-popover-foreground shadow-lg/5 outline-none not-dark:bg-clip-padding data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:animate-in data-expanded:fade-in-0 data-expanded:zoom-in-95"
        data-slot="command-dialog-popup"
      >
        {props.children}
      </DialogPrimitive.Content>
    </div>
  </DialogPrimitive.Portal>
)
