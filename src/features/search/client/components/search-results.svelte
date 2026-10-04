<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { MagnifyingGlassIcon } from '@/components/ui/data-display/icons/svelte'
  import type { ReducedRecipe } from '@/types/recipe'

  import RecipeSearchCard from './recipe-search-card.svelte'
  import SearchResultAddButton from './search-result-add-button.svelte'

  import * as styles from './search-results.css'

  const { recipes, onClearFilters }: { recipes: ReducedRecipe[]; onClearFilters: () => void } = $props()
</script>

{#if recipes.length === 0}
  <div class={styles.container}>
    <div class={styles.emptyStateIcon}><MagnifyingGlassIcon size="xl" /></div>
    <p class={styles.emptyStateDescription}>Aucune recette ne correspond à votre recherche.</p>
    <Button onclick={onClearFilters} variant="outline">Effacer les filtres</Button>
  </div>
{:else}
  <div class={styles.resultsList}>
    <div class={styles.resultCount}>{recipes.length} résultat{recipes.length > 1 ? 's' : ''}</div>
    {#each recipes as recipe, index (recipe.id)}
      <RecipeSearchCard {index} {recipe}>
        {#snippet action()}<SearchResultAddButton recipeId={recipe.id} />{/snippet}
      </RecipeSearchCard>
    {/each}
  </div>
{/if}
