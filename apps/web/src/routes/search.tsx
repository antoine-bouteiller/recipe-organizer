import { mobileMenuItems } from '@client/components/navigation/constants'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { RecentRecipes } from '@client/features/search/components/recent-recipes'
import { SearchFilters } from '@client/features/search/components/search-filters'
import { SearchResults } from '@client/features/search/components/search-results'
import { SearchSkeleton } from '@client/features/search/components/search-skeleton'
import { EMPTY_FILTERS, filterRecipes, hasActiveFilters, type SearchFilters as SearchFiltersValue } from '@client/features/search/utils/filter'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

const SearchRoute = () => {
  const [filters, setFilters] = useState<SearchFiltersValue>(EMPTY_FILTERS)
  const { data: recipes } = useSuspenseQuery(getRecipeListOptions())
  const filtered = useMemo(() => filterRecipes(recipes, filters), [recipes, filters])
  const nonSpiceRecipes = useMemo(() => recipes.filter((recipe) => !recipe.isSpice), [recipes])

  return (
    <ScreenLayout title="Rechercher" footer={<TabBar items={mobileMenuItems} />}>
      <SearchFilters filters={filters} onFiltersChange={setFilters} />
      {hasActiveFilters(filters) ? (
        <SearchResults onClearFilters={() => setFilters(EMPTY_FILTERS)} recipes={filtered} />
      ) : (
        <RecentRecipes recipes={nonSpiceRecipes} />
      )}
    </ScreenLayout>
  )
}

const SearchPending = () => (
  <ScreenLayout title="Rechercher" footer={<TabBar items={mobileMenuItems} />}>
    <SearchSkeleton />
  </ScreenLayout>
)

export const Route = createFileRoute('/search')({
  component: SearchRoute,
  loader: async ({ context }) => {
    await context.queryClient.query({ ...getRecipeListOptions(), staleTime: 'static' })
  },
  pendingComponent: SearchPending,
})
