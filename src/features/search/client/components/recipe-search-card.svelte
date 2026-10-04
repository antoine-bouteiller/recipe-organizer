<script lang="ts">
  import { Link } from '@void/svelte'
  import type { Snippet } from 'svelte'

  import Badge from '@/components/ui/data-display/badge/badge.svelte'
  import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@/features/recipe/constants'
  import { addRecentRecipe } from '@/stores/recent-recipes.store.svelte'
  import type { ReducedRecipe } from '@/types/recipe'

  const { recipe, action, index = 0 }: { recipe: ReducedRecipe; action?: Snippet; index?: number } = $props()
</script>

<div class="stagger-in-45 recipe-search-card-container" style:--stagger={Math.min(index, 10)}>
  <Link
    class={['recipe-search-card-link', action ? 'with-action' : 'without-action']}
    href={`/recipe/${recipe.id}`}
    onclick={() => addRecentRecipe(recipe.id)}
    prefetch
  >
    <img src={recipe.image} alt={recipe.name} class="recipe-search-card-image" decoding="async" loading={index < 6 ? 'eager' : 'lazy'} />
    <div class="recipe-search-card-content">
      <span class="recipe-search-card-name">{recipe.name}</span>
      <div class="recipe-search-card-badges">
        {#if recipe.isVegetarian}<Badge size="sm" variant="accent">{VEGETARIAN_LABEL}</Badge>{/if}
        {#if recipe.isMagimix}<Badge size="sm" variant="accent">{MAGIMIX_LABEL}</Badge>{/if}
        {#if recipe.isSpice}<Badge size="sm" variant="accent">{SPICE_LABEL}</Badge>{/if}
        {#each recipe.meals as meal (meal)}<Badge size="sm" variant="accent">{MEAL_LABELS[meal]}</Badge>{/each}
        {#each recipe.cuisineTypes as cuisineType (cuisineType)}<Badge size="sm" variant="accent">{CUISINE_TYPE_LABELS[cuisineType]}</Badge>{/each}
      </div>
    </div>
  </Link>
  {#if action}<div class="recipe-search-card-action">{@render action()}</div>{/if}
</div>

<style>
  .recipe-search-card-container {
    position: relative;
  }

  :where(.recipe-search-card-container) :global(.recipe-search-card-link:where(.with-action)) {
    align-items: center;
    background: var(--colors-card);
    border-radius: var(--radius-2xl);
    border-width: 1px;
    display: flex;
    gap: 12px;
    padding: 10px;
    padding-right: 56px;
  }

  :where(.recipe-search-card-container) :global(.recipe-search-card-link:where(.without-action)) {
    align-items: center;
    background: var(--colors-card);
    border-radius: var(--radius-2xl);
    border-width: 1px;
    display: flex;
    gap: 12px;
    padding: 10px;
  }

  .recipe-search-card-image {
    border-radius: var(--radius-xl);
    flex-shrink: 0;
    height: 60px;
    object-fit: cover;
    width: 60px;
  }

  .recipe-search-card-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  .recipe-search-card-name {
    color: var(--colors-foreground);
    font-weight: var(--font-weights-bold);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .recipe-search-card-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .recipe-search-card-action {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
