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

  const { recipeId, baseServings, ingredientGroups, presentation = 'standalone' }: RecipeIngredientGroupsProps = $props()
  const quantities = useRecipeQuantities(
    () => recipeId,
    () => baseServings
  )
</script>

{#each ingredientGroups as group}
  <div class="recipe-section-group">
    {#if group.groupName}<div class="recipe-section-group-name">{group.groupName}</div>{/if}
    {#if group.groupIngredients.length > 0}
      <ul class="recipe-section-ingredients" data-presentation={presentation}>
        {#each group.groupIngredients as groupIngredient (groupIngredient.id)}
          <li class="recipe-section-ingredient">
            <div class="recipe-section-ingredient-line">
              <span class="recipe-section-bullet"></span>
              <div class="recipe-section-ingredient-name">{groupIngredient.ingredient.name}</div>
              <div class="recipe-section-quantity">
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

<style>
  .recipe-section-group {
    margin-bottom: 16px;
  }

  .recipe-section-group:last-child {
    margin-bottom: 0px;
  }

  .recipe-section-group-name {
    font-weight: var(--font-weights-semibold);
    margin-bottom: 8px;
    padding-inline: 4px;
  }

  .recipe-section-ingredients:where([data-presentation='embedded']) {
    list-style: none;
    margin: 0px;
  }

  .recipe-section-ingredients:where([data-presentation='standalone']) {
    background: var(--colors-card);
    border-radius: var(--radius-2xl);
    border-width: 1px;
    list-style: none;
    margin: 0px;
    overflow: hidden;
    padding-inline: 14px;
  }

  .recipe-section-ingredient {
    border-bottom-width: 1px;
    font-size: var(--font-sizes-sm);
    line-height: 24px;
    margin: 0px;
    padding-block: 12px;
  }

  .recipe-section-ingredient:last-child {
    border-bottom-width: 0;
  }

  .recipe-section-ingredient-line {
    align-items: center;
    display: flex;
    gap: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .recipe-section-bullet {
    background: var(--colors-primary);
    border-radius: var(--radius-full);
    flex-shrink: 0;
    height: 6px;
    width: 6px;
  }

  .recipe-section-ingredient-name {
    flex: 1;
  }

  .recipe-section-quantity {
    color: var(--colors-muted-foreground);
    font-variant-numeric: tabular-nums;
    font-weight: var(--font-weights-semibold);
  }
</style>
