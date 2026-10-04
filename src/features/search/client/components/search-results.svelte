<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { MagnifyingGlassIcon } from '@/components/ui/data-display/icons'
  import type { ReducedRecipe } from '@/types/recipe'

  import RecipeSearchCard from './recipe-search-card.svelte'
  import SearchResultAddButton from './search-result-add-button.svelte'

  const { recipes, onClearFilters }: { recipes: ReducedRecipe[]; onClearFilters: () => void } = $props()
</script>

{#if recipes.length === 0}
  <div class="search-results-container">
    <div class="search-results-empty-state-icon"><MagnifyingGlassIcon size="xl" /></div>
    <p class="search-results-empty-state-description">Aucune recette ne correspond à votre recherche.</p>
    <Button onclick={onClearFilters} variant="outline">Effacer les filtres</Button>
  </div>
{:else}
  <div class="search-results-results-list">
    <div class="search-results-result-count">{recipes.length} résultat{recipes.length > 1 ? 's' : ''}</div>
    {#each recipes as recipe, index (recipe.id)}
      <RecipeSearchCard {index} {recipe}>
        {#snippet action()}<SearchResultAddButton recipeId={recipe.id} />{/snippet}
      </RecipeSearchCard>
    {/each}
  </div>
{/if}

<style>
  .search-results-container {
    align-items: center;
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    padding: 32px;
    text-align: center;
  }

  .search-results-empty-state-icon {
    align-items: center;
    background: var(--colors-accent);
    border-radius: var(--radius-full);
    color: var(--colors-primary);
    display: flex;
    height: 64px;
    justify-content: center;
    width: 64px;
  }

  .search-results-empty-state-description {
    color: var(--colors-muted-foreground);
    text-wrap: balance;
  }

  .search-results-results-list {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 10px;
  }

  .search-results-result-count {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-xs);
    font-weight: var(--font-weights-semibold);
  }
</style>
