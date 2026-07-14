import { Select as SelectPrimitive, type SelectRootItemComponentProps } from '@kobalte/core/select'
import CaretDown from '~icons/ph/caret-down'
import Check from '~icons/ph/check'

import { type SelectProps } from '@/components/ui/select'
import { getSelectDisplay, selectTriggerIconClassName, selectTriggerVariants } from '@/components/ui/select.shared'
import { cn } from '@/utils/cn'

const NULL_OPTION_SENTINEL_KEY = 'none'

interface SelectOptionObject {
  label: string
  value: string | null
}

const SelectItemRenderer = (itemProps: SelectRootItemComponentProps<SelectOptionObject>) => (
  <SelectPrimitive.Item
    item={itemProps.item}
    class="grid min-h-8 cursor-default grid-cols-[1rem_1fr] items-center justify-start gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none data-disabled:pointer-events-none data-disabled:opacity-64 data-highlighted:bg-accent data-highlighted:text-accent-foreground sm:min-h-7 sm:text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4"
    data-slot="select-item"
  >
    <SelectPrimitive.ItemIndicator class="col-start-1">
      <Check />
    </SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemLabel class="col-start-2 min-w-0">{itemProps.item.rawValue.label}</SelectPrimitive.ItemLabel>
  </SelectPrimitive.Item>
)

const SelectBase = <TValue extends string>(props: SelectProps<TValue>) => {
  const display = () => getSelectDisplay(props)

  const trigger = (
    <SelectPrimitive.Trigger
      class={cn(selectTriggerVariants({ size: props.size }), props.class)}
      data-slot="select-trigger"
      disabled={props.disabled}
    >
      <span class={cn('flex-1 truncate text-left', display().isEmpty && 'text-muted-foreground')}>{display().displayLabel}</span>
      <SelectPrimitive.Icon data-slot="select-icon">
        <CaretDown class={selectTriggerIconClassName} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )

  const content = (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        class="z-50 origin-[var(--kb-select-content-transform-origin)] select-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:animate-in data-expanded:fade-in-0 data-expanded:zoom-in-95"
        data-slot="select-popup"
      >
        <div class="relative min-w-(--kb-popper-anchor-width) rounded-lg border bg-popover shadow-lg/5 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]">
          <SelectPrimitive.Listbox class="max-h-(--kb-popper-content-available-height) overflow-y-auto p-1" data-slot="select-list" />
        </div>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )

  const shared = {
    disabled: props.disabled,
    itemComponent: SelectItemRenderer,
    optionTextValue: (option: SelectOptionObject) => option.label,
    optionValue: (option: SelectOptionObject) => option.value ?? NULL_OPTION_SENTINEL_KEY,
    options: props.items,
  }

  if (props.multiple) {
    return (
      <SelectPrimitive<SelectOptionObject>
        {...shared}
        multiple
        onChange={(options) => props.onValueChange(options.map((option) => option.value as TValue))}
        value={props.items.filter((item) => props.value.includes(item.value as TValue))}
      >
        {trigger}
        {content}
      </SelectPrimitive>
    )
  }

  return (
    <SelectPrimitive<SelectOptionObject>
      {...shared}
      onChange={(option) => props.onValueChange((option?.value ?? null) as TValue | null)}
      value={props.items.find((item) => item.value === (props.value ?? null)) ?? null}
    >
      {trigger}
      {content}
    </SelectPrimitive>
  )
}

export default SelectBase
