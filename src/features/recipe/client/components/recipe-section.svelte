<script module lang="ts">
  import type { Recipe } from '@/features/recipe/client/api/get-one'

  export interface RecipeIngredientGroupsProps {
    readonly recipeId: number
    readonly baseServings: number
    readonly ingredientGroups: Recipe['ingredientGroups']
    readonly presentation?: 'standalone' | 'embedded'
  }
</script>

<script lang="ts">
  import { formatNumber } from '@/utils/number'
  import { scaleQuantity } from '@/utils/scale-quantity'
  import { UNITS } from '@/utils/units'

  import { useRecipeQuantities } from '../hooks/use-recipe-quantities.svelte'

  import * as styles from './recipe-section.css'

  const { recipeId, baseServings, ingredientGroups, presentation = 'standalone' }: RecipeIngredientGroupsProps = $props()
  const quantities = useRecipeQuantities(
    () => recipeId,
    () => baseServings
  )
</script>

{#each ingredientGroups as group}
  <div class={styles.group}>
    {#if group.groupName}<div class={styles.groupName}>{group.groupName}</div>{/if}
    {#if group.groupIngredients.length > 0}
      <ul class={styles.ingredients[presentation]}>
        {#each group.groupIngredients as groupIngredient (groupIngredient.id)}
          <li class={styles.ingredient}>
            <div class={styles.ingredientLine}>
              <span class={styles.bullet}></span>
              <div class={styles.ingredientName}>{groupIngredient.ingredient.name}</div>
              <div class={styles.quantity}>
                {formatNumber(scaleQuantity(groupIngredient.quantity, quantities.quantity, baseServings))}{groupIngredient.unitSlug
                  ? ` ${UNITS[groupIngredient.unitSlug]?.name ?? ''}`
                  : ''}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/each}
