<script lang="ts">
  import { EMPTY_FILTERS, filterRecipes, hasActiveFilters } from '@/features/search/client/utils/filter'
  import type { SearchFilters as SearchFiltersValue } from '@/features/search/client/utils/filter'
  import type { ReducedRecipe } from '@/types/recipe'

  import RecentRecipes from './recent-recipes.svelte'
  import SearchFilters from './search-filters.svelte'
  import SearchResults from './search-results.svelte'

  const { recipes }: { recipes: ReducedRecipe[] } = $props()
  let filters = $state<SearchFiltersValue>(EMPTY_FILTERS)
  const filtered = $derived(filterRecipes(recipes, filters))
  const nonSpiceRecipes = $derived(recipes.filter((recipe) => !recipe.isSpice))
</script>

<SearchFilters {filters} onFiltersChange={(value) => (filters = value)} />
{#if hasActiveFilters(filters)}
  <SearchResults onClearFilters={() => (filters = EMPTY_FILTERS)} recipes={filtered} />
{:else}
  <RecentRecipes recipes={nonSpiceRecipes} />
{/if}
