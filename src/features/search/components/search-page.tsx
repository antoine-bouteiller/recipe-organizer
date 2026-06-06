import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'

import { EMPTY_FILTERS, filterRecipes, hasActiveFilters, type SearchFilters as SearchFiltersValue } from '../utils/filter'
import { RecentRecipes } from './recent-recipes'
import { SearchFilters } from './search-filters'
import { SearchResults } from './search-results'

export const SearchPage = () => {
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
