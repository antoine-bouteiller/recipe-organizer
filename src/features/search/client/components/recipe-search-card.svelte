<script lang="ts">
  import { Link } from '@void/svelte'
  import type { Snippet } from 'svelte'

  import Badge from '@/components/ui/data-display/badge/badge.svelte'
  import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@/features/recipe/constants'
  import { addRecentRecipe } from '@/stores/recent-recipes.store.svelte'
  import type { ReducedRecipe } from '@/types/recipe'

  import * as styles from './recipe-search-card.css'

  const { recipe, action, index = 0 }: { recipe: ReducedRecipe; action?: Snippet; index?: number } = $props()
</script>

<div class={styles.container} style:--stagger={Math.min(index, 10)}>
  <Link
    class={styles.card[action ? 'withAction' : 'withoutAction']}
    href={`/recipe/${recipe.id}`}
    onclick={() => addRecentRecipe(recipe.id)}
    prefetch
  >
    <img src={recipe.image} alt={recipe.name} class={styles.image} decoding="async" loading={index < 6 ? 'eager' : 'lazy'} />
    <div class={styles.content}>
      <span class={styles.name}>{recipe.name}</span>
      <div class={styles.badges}>
        {#if recipe.isVegetarian}<Badge size="sm" variant="accent">{VEGETARIAN_LABEL}</Badge>{/if}
        {#if recipe.isMagimix}<Badge size="sm" variant="accent">{MAGIMIX_LABEL}</Badge>{/if}
        {#if recipe.isSpice}<Badge size="sm" variant="accent">{SPICE_LABEL}</Badge>{/if}
        {#each recipe.meals as meal (meal)}<Badge size="sm" variant="accent">{MEAL_LABELS[meal]}</Badge>{/each}
        {#each recipe.cuisineTypes as cuisineType (cuisineType)}<Badge size="sm" variant="accent">{CUISINE_TYPE_LABELS[cuisineType]}</Badge>{/each}
      </div>
    </div>
  </Link>
  {#if action}<div class={styles.action}>{@render action()}</div>{/if}
</div>
