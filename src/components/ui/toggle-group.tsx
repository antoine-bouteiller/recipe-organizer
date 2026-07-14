import { ToggleGroup as ToggleGroupPrimitive } from '@kobalte/core/toggle-group'
import { For } from 'solid-js'

import { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/utils/cn'

interface ToggleGroupProps {
  items: { label: string; value: string }[]
  value: string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
  class?: string
}

export const ToggleGroup = (props: ToggleGroupProps) => (
  <div class={cn('max-w-full overflow-x-auto overflow-y-hidden', props.class)}>
    <ToggleGroupPrimitive
      class="flex w-fit gap-0.5 *:focus-visible:z-10 *:pointer-coarse:after:min-w-auto dark:*:[[data-slot=separator]:has(+[data-slot=toggle]:hover)]:before:bg-input/64 dark:*:[[data-slot=separator]:has(+[data-slot=toggle][data-pressed])]:before:bg-input dark:*:[[data-slot=toggle]:hover+[data-slot=separator]]:before:bg-input/64 dark:*:[[data-slot=toggle][data-pressed]+[data-slot=separator]]:before:bg-input"
      data-size="default"
      data-slot="toggle-group"
      data-variant="default"
      disabled={props.disabled}
      multiple
      onChange={props.onValueChange}
      value={props.value}
    >
      <For each={props.items}>
        {(item) => (
          <ToggleGroupPrimitive.Item class={cn(toggleVariants(), 'shrink-0')} data-slot="toggle" value={item.value}>
            {item.label}
          </ToggleGroupPrimitive.Item>
        )}
      </For>
    </ToggleGroupPrimitive>
  </div>
)
