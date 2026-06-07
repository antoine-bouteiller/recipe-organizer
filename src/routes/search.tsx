import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { RecentRecipes } from '@/features/search/components/recent-recipes'
import { SearchFilters } from '@/features/search/components/search-filters'
import { SearchResults } from '@/features/search/components/search-results'
import { EMPTY_FILTERS, filterRecipes, hasActiveFilters, type SearchFilters as SearchFiltersValue } from '@/features/search/utils/filter'

const SearchPage = () => {
  const [filters, setFilters] = useState<SearchFiltersValue>(EMPTY_FILTERS)

  const { data: recipes } = useSuspenseQuery(getRecipeListOptions())

  const filtered = useMemo(() => filterRecipes(recipes, filters), [recipes, filters])

  const clearFilters = () => setFilters(EMPTY_FILTERS)

  return (
    <ScreenLayout title="Rechercher" pageKey="/search">
      <div className="sticky top-0 z-10 flex flex-col gap-2 bg-background px-4 pt-4 pb-2">
        <SearchFilters filters={filters} onFiltersChange={setFilters} />
      </div>
      {hasActiveFilters(filters) ? <SearchResults onClearFilters={clearFilters} recipes={filtered} /> : <RecentRecipes recipes={recipes} />}
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/search')({
  component: SearchPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRecipeListOptions())
  },
})
