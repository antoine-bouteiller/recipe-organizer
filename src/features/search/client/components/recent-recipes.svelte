<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { clearRecentRecipes, useRecentRecipeIds } from '@/stores/recent-recipes.store.svelte'
  import type { ReducedRecipe } from '@/types/recipe'

  import RecipeSearchCard from './recipe-search-card.svelte'

  const { recipes }: { recipes: ReducedRecipe[] } = $props()
  const recentRecipeIds = useRecentRecipeIds()
  const recentRecipes = $derived(
    recentRecipeIds.current.map((id) => recipes.find((recipe) => recipe.id === id)).filter((recipe): recipe is ReducedRecipe => recipe !== undefined)
  )
</script>

{#if recentRecipes.length === 0}
  <div class="recent-recipes-container">
    {#each recipes as recipe (recipe.id)}<RecipeSearchCard {recipe} />{/each}
  </div>
{:else}
  <div class="recent-recipes-recent-recipes">
    <div class="recent-recipes-recent-recipes-header">
      <h2 class="recent-recipes-heading">Recherches récentes</h2>
      <Button onclick={clearRecentRecipes} size="sm" variant="ghost">Effacer</Button>
    </div>
    <div class="recent-recipes-container">
      {#each recentRecipes as recipe}<RecipeSearchCard {recipe} />{/each}
    </div>
  </div>
{/if}

<style>
  .recent-recipes-container {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 10px;
  }

  .recent-recipes-recent-recipes {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
  }

  .recent-recipes-recent-recipes-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding-bottom: 4px;
    padding-top: 8px;
  }

  .recent-recipes-heading {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-xs);
    font-weight: var(--font-weights-semibold);
    letter-spacing: var(--letter-spacings-wider);
    text-transform: uppercase;
  }
</style>
