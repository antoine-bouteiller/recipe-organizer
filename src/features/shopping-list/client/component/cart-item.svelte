<script lang="ts">
  import Toggle from '@/components/ui/actions/toggle/toggle.svelte'
  import { formatNumber } from '@/utils/number'
  import { UNITS } from '@/utils/units'
  import type { UnitSlug } from '@/utils/units'

  import type { IngredientCartItem } from '../types/ingredient-cart-item'

  const { ingredient }: { ingredient: IngredientCartItem } = $props()
  let isChecked = $state(false)
  const formatQuantityWithUnit = (quantity: number, unitSlug: UnitSlug | null) => {
    const label = unitSlug ? (UNITS[unitSlug]?.name ?? '') : ''
    return label ? `${formatNumber(quantity)} ${label}` : formatNumber(quantity)
  }
</script>

<Toggle onPressedChange={(pressed) => (isChecked = pressed)} presentation="check-row" pressed={isChecked}>
  <span class="cart-item-details">
    <span>{ingredient.name}</span>
    <span class="cart-item-quantities">
      <span>{formatQuantityWithUnit(ingredient.primary.quantity, ingredient.primary.unitSlug)}</span>
      {#each ingredient.fallback as line (line.unitSlug ?? 'unitless')}
        <span class="cart-item-fallback-quantity">+ {formatQuantityWithUnit(line.quantity, line.unitSlug)}</span>
      {/each}
    </span>
  </span>
</Toggle>

<style>
  .cart-item-details {
    align-items: center;
    display: flex;
    flex: 1;
    gap: 8px;
    justify-content: space-between;
  }

  .cart-item-quantities {
    align-items: flex-end;
    color: var(--colors-muted-foreground);
    display: flex;
    flex-direction: column;
    font-size: var(--font-sizes-sm);
    font-variant-numeric: tabular-nums;
    font-weight: var(--font-weights-semibold);
  }

  .cart-item-fallback-quantity {
    font-size: var(--font-sizes-xs);
  }
</style>
