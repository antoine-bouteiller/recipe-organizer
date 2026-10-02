import { RecentRecipes } from '@client/features/search/components/recent-recipes'
import { SearchFilters } from '@client/features/search/components/search-filters'
import { SearchResults } from '@client/features/search/components/search-results'
import { EMPTY_FILTERS, filterRecipes, hasActiveFilters } from '@client/features/search/utils/filter'
import type { SearchFilters as SearchFiltersValue } from '@client/features/search/utils/filter'
import type { ReducedRecipe } from '@client/types/recipe'
import { useState } from 'react'

export const RecipeSearch = ({ recipes }: { readonly recipes: ReducedRecipe[] }) => {
  const [filters, setFilters] = useState<SearchFiltersValue>(EMPTY_FILTERS)
  const filtered = filterRecipes(recipes, filters)
  const nonSpiceRecipes = recipes.filter((recipe) => !recipe.isSpice)

  return (
    <>
      <SearchFilters filters={filters} onFiltersChange={setFilters} />
      {hasActiveFilters(filters) ? (
        <SearchResults onClearFilters={() => setFilters(EMPTY_FILTERS)} recipes={filtered} />
      ) : (
        <RecentRecipes recipes={nonSpiceRecipes} />
      )}
    </>
  )
}
