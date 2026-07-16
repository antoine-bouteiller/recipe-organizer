import { type ComponentProps, splitProps } from 'solid-js'
import CaretDown from '~icons/ph/caret-down'

import { type SelectProps } from '@/components/ui/select'
import { cn } from '@/utils/cn'

export const selectTriggerClassName =
  "relative inline-flex min-h-9 w-full min-w-36 select-none items-center justify-between gap-2 rounded-lg border border-input bg-background not-dark:bg-clip-padding px-[calc(--spacing(3)-1px)] text-left text-base text-foreground shadow-xs/5 outline-none ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16 data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm dark:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [[data-disabled],:focus-visible,[aria-invalid],[data-pressed]]:shadow-none"

export const selectTriggerIconClassName = '-me-1 size-4.5 opacity-80 sm:size-4'

export const SelectButton = (props: ComponentProps<'button'>) => {
  const [local, rest] = splitProps(props, ['class', 'children'])

  return (
    <button class={cn(selectTriggerClassName, 'min-w-0', local.class)} data-slot="select-button" type="button" {...rest}>
      <span class="flex-1 truncate in-data-placeholder:text-muted-foreground/72">{local.children}</span>
      <CaretDown class={selectTriggerIconClassName} />
    </button>
  )
}

export const getSelectDisplay = <TValue extends string>(
  props: SelectProps<TValue>
): { displayLabel: string; isEmpty: boolean; isSelected: (value: string | null) => boolean } => {
  const placeholder = props.placeholder ?? 'Sélectionner'
  const isSelected = (value: string | null): boolean => (props.multiple ? props.value.includes(value as TValue) : (props.value ?? null) === value)
  const selectedLabels = props.items.filter((item) => isSelected(item.value)).map((item) => item.label)
  const isEmpty = selectedLabels.length === 0
  const displayLabel = isEmpty ? placeholder : selectedLabels[0] + (selectedLabels.length > 1 ? ` (+${selectedLabels.length - 1})` : '')

  return { displayLabel, isEmpty, isSelected }
}
