import { UNITS, type UnitSlug } from '@schema'
import { createSignal, For, Show } from 'solid-js'
import Check from '~icons/ph/check-bold'

import { cn } from '@/utils/cn'
import { formatNumber } from '@/utils/number'

import { type IngredientCartItem } from '../types/ingredient-cart-item'

const formatUnitLabel = (slug: UnitSlug | null) => (slug ? (UNITS[slug]?.name ?? '') : '')

const formatQuantityWithUnit = (quantity: number, unitSlug: UnitSlug | null) => {
  const label = formatUnitLabel(unitSlug)
  return label ? `${formatNumber(quantity)} ${label}` : formatNumber(quantity)
}

export const CartItem = (props: { ingredient: IngredientCartItem }) => {
  const [isChecked, setIsChecked] = createSignal(false)

  return (
    <button
      class="flex w-full items-center gap-3 border-b py-3 text-left last:border-b-0"
      onClick={() => setIsChecked((checked) => !checked)}
      type="button"
    >
      <span
        class={cn(
          'flex size-5.5 shrink-0 items-center justify-center rounded-full border-2',
          isChecked() ? 'border-primary bg-primary text-white' : 'border-muted-foreground/40'
        )}
      >
        <Show when={isChecked()}>
          <Check class="size-3" />
        </Show>
      </span>
      <span class={cn('flex flex-1 items-center justify-between gap-2', isChecked() && 'text-muted-foreground line-through')}>
        <span>{props.ingredient.name}</span>
        <span class="flex flex-col items-end text-sm font-semibold text-muted-foreground">
          <span>{formatQuantityWithUnit(props.ingredient.primary.quantity, props.ingredient.primary.unitSlug)}</span>
          <For each={props.ingredient.fallback}>
            {(line) => <span class="text-xs">+ {formatQuantityWithUnit(line.quantity, line.unitSlug)}</span>}
          </For>
        </span>
      </span>
    </button>
  )
}
