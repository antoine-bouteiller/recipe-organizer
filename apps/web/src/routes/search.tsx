import { mobileMenuItems } from '@client/components/navigation/constants'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { RecentRecipes } from '@client/features/search/components/recent-recipes'
import { SearchFilters } from '@client/features/search/components/search-filters'
import { SearchResults } from '@client/features/search/components/search-results'
import { SearchSkeleton } from '@client/features/search/components/search-skeleton'
import { EMPTY_FILTERS, filterRecipes, hasActiveFilters, type SearchFilters as SearchFiltersValue } from '@client/features/search/utils/filter'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

const SearchRoute = () => {
  const [filters, setFilters] = useState<SearchFiltersValue>(EMPTY_FILTERS)
  const { data: recipes, isLoading } = useQuery(getRecipeListOptions())
  const filtered = filterRecipes(recipes ?? [], filters)
  const nonSpiceRecipes = recipes?.filter((recipe) => !recipe.isSpice) ?? []

  return (
    <ScreenLayout title="Rechercher" footer={<TabBar items={mobileMenuItems} />}>
      {isLoading ? (
        <SearchSkeleton />
      ) : (
        <>
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
          {hasActiveFilters(filters) ? (
            <SearchResults onClearFilters={() => setFilters(EMPTY_FILTERS)} recipes={filtered} />
          ) : (
            <RecentRecipes recipes={nonSpiceRecipes} />
          )}
        </>
      )}
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/search')({
  component: SearchRoute,
})
