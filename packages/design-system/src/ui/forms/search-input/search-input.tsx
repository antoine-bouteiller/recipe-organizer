import { cn } from 'cn'
import type React from 'react'

import { MagnifyingGlassIcon } from '../../data-display/icons/magnifying-glass'
import { Input, type InputProps as InputControlProps } from '../input/input'

const inputGroupAddonClassName =
  "order-first flex h-auto cursor-text select-none items-center justify-center gap-2 ps-[calc(--spacing(3)-1px)] leading-none in-[[data-slot=input-group]:has([data-slot=input-control])]:[&_svg:not([class*='size-'])]:size-4.5 sm:in-[[data-slot=input-group]:has([data-slot=input-control])]:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5 not-has-[button]:**:[svg:not([class*='opacity-'])]:opacity-80"

const InputGroup = ({ className, ...props }: React.ComponentProps<'div'>): React.ReactElement => (
  <div
    className={cn(
      'relative inline-flex w-full min-w-0 items-center rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-[input:disabled]:not-has-[input:focus-visible]:not-has-[input[aria-invalid]]:before:shadow-[0_1px_--theme(--color-black/4%)] has-[input:focus-visible]:has-[input[aria-invalid]]:border-destructive/64 has-[input:focus-visible]:has-[input[aria-invalid]]:ring-destructive/16 has-[input:focus-visible]:border-ring has-[input[aria-invalid]]:border-destructive/36 has-autofill:bg-foreground/4 has-[input:disabled]:opacity-64 has-[input:disabled,input:focus-visible,input[aria-invalid]]:shadow-none has-[input:focus-visible]:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-[input[aria-invalid]]:ring-destructive/24 dark:not-has-[input:disabled]:not-has-[input:focus-visible]:not-has-[input[aria-invalid]]:before:shadow-[0_-1px_--theme(--color-white/6%)] *:[[data-slot=input-control]]:contents *:[[data-slot=input-control]]:before:hidden **:[input]:ps-2',
      className
    )}
    data-slot="input-group"
    role="group"
    {...props}
  />
)

const InputGroupAddon = ({ className, ...props }: React.ComponentProps<'div'>): React.ReactElement => (
  <div
    className={cn(inputGroupAddonClassName, className)}
    data-slot="input-group-addon"
    onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
      const { target } = event
      const isInteractive =
        target instanceof HTMLElement &&
        target.closest("button, a, input, select, textarea, [role='button'], [role='combobox'], [role='listbox'], [data-slot='select-trigger']")
      if (isInteractive) {
        return
      }
      event.preventDefault()
      const parent = event.currentTarget.parentElement
      const input = parent?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
      if (input && !parent?.querySelector('input:focus, textarea:focus')) {
        input.focus()
      }
    }}
    {...props}
  />
)

const InputGroupInput = ({ className, ...props }: InputControlProps): React.ReactElement => <Input className={className} unstyled {...props} />

interface InputProps {
  autoFocus?: boolean
  placeholder?: string
  search: string
  setSearch: (value: string) => void
}

// Also used by the buttons next to a SearchInput: --input is white/8% in dark, so the outline variant's dark:bg-input/32 lands at ~2.5% white and reads as no background over a transparent sticky band.
export const glassSurface = 'bg-background/72 backdrop-blur-xl dark:bg-input/48'

export const SearchInput = ({ autoFocus, placeholder = 'Rechercher…', search, setSearch }: InputProps) => (
  <InputGroup className={glassSurface}>
    <InputGroupInput
      aria-label={placeholder}
      autoFocus={autoFocus}
      onChange={(event) => setSearch(event.target.value)}
      placeholder={placeholder}
      size="lg"
      value={search}
    />
    <InputGroupAddon>
      <MagnifyingGlassIcon />
    </InputGroupAddon>
  </InputGroup>
)
