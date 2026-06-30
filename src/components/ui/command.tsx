import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete'
import { Dialog as CommandDialogPrimitive } from '@base-ui/react/dialog'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import React from 'react'

import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/utils/cn'

const Autocomplete: typeof AutocompletePrimitive.Root = AutocompletePrimitive.Root

const AutocompleteInput = ({
  className,
  startAddon,
  size,
  ...props
}: Omit<AutocompletePrimitive.Input.Props, 'size'> & {
  startAddon?: React.ReactNode
  size?: 'sm' | 'default' | 'lg' | number
  ref?: React.Ref<HTMLInputElement>
}): React.ReactElement => {
  const sizeValue = size ?? 'default'

  return (
    <AutocompletePrimitive.InputGroup
      className="relative w-full text-foreground not-has-[>*.w-full]:w-fit has-disabled:opacity-64"
      data-slot="autocomplete-input-group"
    >
      {startAddon && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg]:-mx-0.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4"
          data-slot="autocomplete-start-addon"
        >
          {startAddon}
        </div>
      )}
      <AutocompletePrimitive.Input
        className={cn(
          startAddon &&
            'data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7.5)-1px)] *:data-[slot=autocomplete-input]:ps-[calc(--spacing(8.5)-1px)] sm:data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7)-1px)] sm:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(8)-1px)]',
          sizeValue === 'sm'
            ? 'has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-6.5'
            : 'has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-7',
          className
        )}
        data-slot="autocomplete-input"
        render={<Input nativeInput size={sizeValue} />}
        {...props}
      />
    </AutocompletePrimitive.InputGroup>
  )
}

const AutocompleteItem = ({ className, children, ...props }: AutocompletePrimitive.Item.Props): React.ReactElement => (
  <AutocompletePrimitive.Item
    className={cn(
      'flex min-h-8 cursor-default select-none items-center rounded-sm px-2 py-1 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm',
      className
    )}
    data-slot="autocomplete-item"
    {...props}
  >
    {children}
  </AutocompletePrimitive.Item>
)

const AutocompleteEmpty = ({ className, ...props }: AutocompletePrimitive.Empty.Props): React.ReactElement => (
  <AutocompletePrimitive.Empty
    className={cn('not-empty:p-2 text-center text-base text-muted-foreground sm:text-sm', className)}
    data-slot="autocomplete-empty"
    {...props}
  />
)

const AutocompleteList = ({ className, ...props }: AutocompletePrimitive.List.Props): React.ReactElement => (
  <ScrollArea scrollbarGutter scrollFade>
    <AutocompletePrimitive.List
      className={cn('not-empty:scroll-py-1 not-empty:p-1 in-data-has-overflow-y:pe-3', className)}
      data-slot="autocomplete-list"
      {...props}
    />
  </ScrollArea>
)

export const CommandDialog: typeof CommandDialogPrimitive.Root = CommandDialogPrimitive.Root

const CommandDialogPortal: typeof CommandDialogPrimitive.Portal = CommandDialogPrimitive.Portal

export const CommandDialogTrigger = (props: CommandDialogPrimitive.Trigger.Props): React.ReactElement => (
  <CommandDialogPrimitive.Trigger data-slot="command-dialog-trigger" {...props} />
)

const CommandDialogBackdrop = ({ className, ...props }: CommandDialogPrimitive.Backdrop.Props): React.ReactElement => (
  <CommandDialogPrimitive.Backdrop
    className={cn(
      'fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0',
      className
    )}
    data-slot="command-dialog-backdrop"
    {...props}
  />
)

const CommandDialogViewport = ({ className, ...props }: CommandDialogPrimitive.Viewport.Props): React.ReactElement => (
  <CommandDialogPrimitive.Viewport
    className={cn('fixed inset-0 z-50 flex flex-col items-center px-4 py-[max(--spacing(4),4vh)] sm:py-[10vh]', className)}
    data-slot="command-dialog-viewport"
    {...props}
  />
)

export const CommandDialogPopup = ({ className, children, ...props }: CommandDialogPrimitive.Popup.Props): React.ReactElement => (
  <CommandDialogPortal>
    <CommandDialogBackdrop />
    <CommandDialogViewport>
      <CommandDialogPrimitive.Popup
        className={cn(
          'relative row-start-2 flex max-h-105 min-h-0 w-full min-w-0 max-w-xl -translate-y-[calc(1.25rem*var(--nested-dialogs))] scale-[calc(1-0.1*var(--nested-dialogs))] flex-col rounded-2xl border bg-popover not-dark:bg-clip-padding text-popover-foreground opacity-[calc(1-0.1*var(--nested-dialogs))] shadow-lg/5 outline-none transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:bg-muted/72 before:shadow-[0_1px_--theme(--color-black/4%)] data-nested:data-ending-style:translate-y-8 data-nested:data-starting-style:translate-y-8 data-nested-dialog-open:origin-top data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 **:data-[slot=scroll-area-viewport]:data-has-overflow-y:pe-1 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
          className
        )}
        data-slot="command-dialog-popup"
        {...props}
      >
        {children}
      </CommandDialogPrimitive.Popup>
    </CommandDialogViewport>
  </CommandDialogPortal>
)

export const Command = ({
  autoHighlight = 'always',
  keepHighlight = true,
  ...props
}: React.ComponentProps<typeof Autocomplete>): React.ReactElement => (
  <Autocomplete autoHighlight={autoHighlight} inline keepHighlight={keepHighlight} open {...props} />
)

export const CommandInput = ({ className, placeholder, ...props }: React.ComponentProps<typeof AutocompleteInput>): React.ReactElement => (
  <div className="px-2.5 py-1.5">
    <AutocompleteInput
      autoFocus
      className={cn('border-transparent! bg-transparent! shadow-none before:hidden has-focus-visible:ring-0', className)}
      placeholder={placeholder}
      size="lg"
      startAddon={<MagnifyingGlassIcon />}
      {...props}
    />
  </div>
)

export const CommandList = ({ className, ...props }: React.ComponentProps<typeof AutocompleteList>): React.ReactElement => (
  <AutocompleteList className={cn('not-empty:scroll-py-2 not-empty:p-2', className)} data-slot="command-list" {...props} />
)

export const CommandEmpty = ({ className, ...props }: React.ComponentProps<typeof AutocompleteEmpty>): React.ReactElement => (
  <AutocompleteEmpty className={cn('not-empty:py-6', className)} data-slot="command-empty" {...props} />
)

export const CommandPanel = ({ className: _className, ...props }: React.ComponentProps<'div'>): React.ReactElement => (
  <div
    className="relative -mx-px min-h-0 rounded-t-xl border border-b-0 bg-popover bg-clip-padding shadow-xs/5 [clip-path:inset(0_1px)] not-has-[+[data-slot=command-footer]]:-mb-px not-has-[+[data-slot=command-footer]]:rounded-b-2xl not-has-[+[data-slot=command-footer]]:[clip-path:inset(0_1px_1px_1px_round_0_0_calc(var(--radius-2xl)-1px)_calc(var(--radius-2xl)-1px))] before:pointer-events-none before:absolute before:inset-0 before:rounded-t-[calc(var(--radius-xl)-1px)] **:data-[slot=scroll-area-scrollbar]:mt-2"
    {...props}
  />
)

export const CommandItem = ({ className, ...props }: React.ComponentProps<typeof AutocompleteItem>): React.ReactElement => (
  <AutocompleteItem className={cn('py-1.5', className)} data-slot="command-item" {...props} />
)

export const CommandFooter = ({ className, ...props }: React.ComponentProps<'div'>): React.ReactElement => (
  <div
    className={cn(
      'relative flex items-center justify-between gap-2 rounded-b-[calc(var(--radius-2xl)-1px)] border-t px-5 py-3 text-muted-foreground text-xs',
      className
    )}
    data-slot="command-footer"
    {...props}
  />
)
