import { useState } from 'react'

import { RecentRecipes } from '@/features/search/client/components/recent-recipes'
import { SearchFilters } from '@/features/search/client/components/search-filters'
import { SearchResults } from '@/features/search/client/components/search-results'
import { EMPTY_FILTERS, filterRecipes, hasActiveFilters } from '@/features/search/client/utils/filter'
import type { SearchFilters as SearchFiltersValue } from '@/features/search/client/utils/filter'
import type { ReducedRecipe } from '@/types/recipe'

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
