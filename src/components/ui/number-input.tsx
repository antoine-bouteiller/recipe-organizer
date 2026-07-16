import { NumberField as NumberFieldPrimitive } from '@kobalte/core/number-field'
import { Show } from 'solid-js'
import Minus from '~icons/ph/minus'
import Plus from '~icons/ph/plus'

interface NumberInputProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  label?: string
  placeholder?: string
  disabled?: boolean
}

export const NumberInput = (props: NumberInputProps) => (
  <NumberFieldPrimitive
    class="flex w-full flex-col items-start gap-2"
    data-slot="number-field"
    disabled={props.disabled}
    maxValue={props.max}
    minValue={props.min}
    onRawValueChange={props.onChange}
    rawValue={props.value}
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
        class="relative flex shrink-0 cursor-pointer items-center justify-center rounded-s-[calc(var(--radius-lg)-1px)] px-[calc(--spacing(3)-1px)] transition-colors hover:bg-accent"
        data-slot="number-field-decrement"
      >
        <Minus />
      </NumberFieldPrimitive.DecrementTrigger>
      <NumberFieldPrimitive.Input
        class="h-8.5 w-full min-w-0 grow bg-transparent px-[calc(--spacing(3)-1px)] text-center leading-8.5 tabular-nums outline-none sm:h-7.5"
        data-slot="number-field-input"
        placeholder={props.placeholder}
      />
      <NumberFieldPrimitive.IncrementTrigger
        aria-label="Incrémenter"
        class="relative flex shrink-0 cursor-pointer items-center justify-center rounded-e-[calc(var(--radius-lg)-1px)] px-[calc(--spacing(3)-1px)] transition-colors hover:bg-accent"
        data-slot="number-field-increment"
      >
        <Plus />
      </NumberFieldPrimitive.IncrementTrigger>
    </div>
  </NumberFieldPrimitive>
)
