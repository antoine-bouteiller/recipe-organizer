import { NumberField as NumberFieldPrimitive } from '@kobalte/core/number-field'
import { Minus, Plus } from 'phosphor-solid'
import { Show } from 'solid-js'

import { cn } from '@/utils/cn'

interface NumberInputProps {
  value?: number
  onChange?: (value: number) => void
  onBlur?: () => void
  min?: number
  max?: number
  step?: number
  size?: 'sm' | 'default' | 'lg'
  label?: string
  placeholder?: string
  class?: string
  id?: string
  name?: string
  disabled?: boolean
}

export const NumberInput = (props: NumberInputProps) => (
  <NumberFieldPrimitive
    class={cn('flex w-full flex-col items-start gap-2', props.class)}
    data-size={props.size ?? 'default'}
    data-slot="number-field"
    disabled={props.disabled}
    id={props.id}
    maxValue={props.max}
    minValue={props.min}
    name={props.name}
    onRawValueChange={props.onChange}
    rawValue={props.value}
    step={props.step}
  >
    <Show when={props.label}>
      <NumberFieldPrimitive.Label class="inline-flex items-center gap-2 text-base/4.5 font-medium text-foreground sm:text-sm/4">
        {props.label}
      </NumberFieldPrimitive.Label>
    </Show>
    <div
      class="relative flex w-full justify-between rounded-lg border border-input bg-background text-base text-foreground shadow-xs/5 transition-shadow not-dark:bg-clip-padding focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/24 sm:text-sm dark:bg-input/32 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4"
      data-slot="number-field-group"
    >
      <NumberFieldPrimitive.DecrementTrigger
        aria-label="Décrémenter"
        class="relative flex shrink-0 cursor-pointer items-center justify-center rounded-s-[calc(var(--radius-lg)-1px)] px-[calc(--spacing(3)-1px)] transition-colors hover:bg-accent in-data-[size=sm]:px-[calc(--spacing(2.5)-1px)]"
        data-slot="number-field-decrement"
      >
        <Minus />
      </NumberFieldPrimitive.DecrementTrigger>
      <NumberFieldPrimitive.Input
        class="h-8.5 w-full min-w-0 grow bg-transparent px-[calc(--spacing(3)-1px)] text-center leading-8.5 tabular-nums outline-none in-data-[size=lg]:h-9.5 in-data-[size=sm]:h-7.5 in-data-[size=sm]:px-[calc(--spacing(2.5)-1px)] sm:h-7.5"
        data-slot="number-field-input"
        onBlur={props.onBlur}
        placeholder={props.placeholder}
      />
      <NumberFieldPrimitive.IncrementTrigger
        aria-label="Incrémenter"
        class="relative flex shrink-0 cursor-pointer items-center justify-center rounded-e-[calc(var(--radius-lg)-1px)] px-[calc(--spacing(3)-1px)] transition-colors hover:bg-accent in-data-[size=sm]:px-[calc(--spacing(2.5)-1px)]"
        data-slot="number-field-increment"
      >
        <Plus />
      </NumberFieldPrimitive.IncrementTrigger>
    </div>
  </NumberFieldPrimitive>
)
