<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { clearRecentRecipes, useRecentRecipeIds } from '@/stores/recent-recipes.store.svelte'
  import type { ReducedRecipe } from '@/types/recipe'

  import RecipeSearchCard from './recipe-search-card.svelte'

  import * as styles from './recent-recipes.css'

  const { recipes }: { recipes: ReducedRecipe[] } = $props()
  const recentRecipeIds = useRecentRecipeIds()
  const recentRecipes = $derived(
    recentRecipeIds.current.map((id) => recipes.find((recipe) => recipe.id === id)).filter((recipe): recipe is ReducedRecipe => recipe !== undefined)
  )
</script>

{#if recentRecipes.length === 0}
  <div class={styles.container}>
    {#each recipes as recipe (recipe.id)}<RecipeSearchCard {recipe} />{/each}
  </div>
{:else}
  <div class={styles.recentRecipes}>
    <div class={styles.recentRecipesHeader}>
      <h2 class={styles.heading}>Recherches récentes</h2>
      <Button onclick={clearRecentRecipes} size="sm" variant="ghost">Effacer</Button>
    </div>
    <div class={styles.container}>
      {#each recentRecipes as recipe}<RecipeSearchCard {recipe} />{/each}
    </div>
  </div>
{/if}
