<script lang="ts">
  import Toggle from '@/components/ui/actions/toggle/toggle.svelte'
  import { formatNumber } from '@/utils/number'
  import { UNITS } from '@/utils/units'
  import type { UnitSlug } from '@/utils/units'

  import type { IngredientCartItem } from '../types/ingredient-cart-item'

  import * as styles from './cart-item.css'

  const { ingredient }: { ingredient: IngredientCartItem } = $props()
  let isChecked = $state(false)
  const formatQuantityWithUnit = (quantity: number, unitSlug: UnitSlug | null) => {
    const label = unitSlug ? (UNITS[unitSlug]?.name ?? '') : ''
    return label ? `${formatNumber(quantity)} ${label}` : formatNumber(quantity)
  }
</script>

<Toggle onPressedChange={(pressed) => (isChecked = pressed)} presentation="check-row" pressed={isChecked}>
  <span class={styles.details}>
    <span>{ingredient.name}</span>
    <span class={styles.quantities}>
      <span>{formatQuantityWithUnit(ingredient.primary.quantity, ingredient.primary.unitSlug)}</span>
      {#each ingredient.fallback as line (line.unitSlug ?? 'unitless')}
        <span class={styles.fallbackQuantity}>+ {formatQuantityWithUnit(line.quantity, line.unitSlug)}</span>
      {/each}
    </span>
  </span>
</Toggle>
