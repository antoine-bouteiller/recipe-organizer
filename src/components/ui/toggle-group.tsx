import { ToggleGroup as ToggleGroupPrimitive } from '@kobalte/core/toggle-group'
import { For } from 'solid-js'

import { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/utils/cn'

interface ToggleGroupProps {
  items: { label: string; value: string }[]
  value: string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
}

export const ToggleGroup = (props: ToggleGroupProps) => (
  <div class="max-w-full overflow-x-auto overflow-y-hidden">
    <ToggleGroupPrimitive
      class="flex w-fit gap-0.5 *:focus-visible:z-10 *:pointer-coarse:after:min-w-auto dark:*:[[data-slot=separator]:has(+[data-slot=toggle]:hover)]:before:bg-input/64 dark:*:[[data-slot=separator]:has(+[data-slot=toggle][data-pressed])]:before:bg-input dark:*:[[data-slot=toggle]:hover+[data-slot=separator]]:before:bg-input/64 dark:*:[[data-slot=toggle][data-pressed]+[data-slot=separator]]:before:bg-input"
      data-slot="toggle-group"
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
