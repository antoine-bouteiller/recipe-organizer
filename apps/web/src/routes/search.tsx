import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'
import { ScreenLayout } from '@client/components/layout/screen-layout'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { RecentRecipes } from '@client/features/search/components/recent-recipes'
import { SearchFilterTrigger } from '@client/features/search/components/search-filter-trigger'
import { SearchResults } from '@client/features/search/components/search-results'
import { EMPTY_FILTERS, filterRecipes, hasActiveFilters, type SearchFilters as SearchFiltersValue } from '@client/features/search/utils/filter'
import { SearchInput } from '@recipe-organizer/design-system/search-input'
import { Select } from '@recipe-organizer/design-system/select'
import { Skeleton } from '@recipe-organizer/design-system/skeleton'
import { Toggle } from '@recipe-organizer/design-system/toggle'
import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '@recipe-organizer/shared/recipe/constants'
import { incrementalArray } from '@recipe-organizer/shared/utils/array'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { container, container2, container3, element, container4, container5, container6, container7 } from './-search.css'

const cuisineItems = CUISINE_TYPES.map((cuisineType) => ({
  label: CUISINE_TYPE_LABELS[cuisineType],
  value: cuisineType,
}))

const mealItems = MEALS.map((meal) => ({
  label: MEAL_LABELS[meal],
  value: meal,
}))

const SearchPage = () => {
  const [filters, setFilters] = useState<SearchFiltersValue>(EMPTY_FILTERS)

  const { data: recipes } = useSuspenseQuery(getRecipeListOptions())

  const filtered = useMemo(() => filterRecipes(recipes, filters), [recipes, filters])
  const nonSpiceRecipes = useMemo(() => recipes.filter((recipe) => !recipe.isSpice), [recipes])

  const clearFilters = () => setFilters(EMPTY_FILTERS)

  return (
    <ScreenLayout title="Rechercher" pageKey="/search">
      <div className={container}>
        <CollapsiblePrimitive.Root>
          <div className={container2}>
            <div className={container3}>
              <SearchInput
                placeholder="Rechercher une recette, un ingrédient…"
                autoFocus
                search={filters.query}
                setSearch={(query) => setFilters({ ...filters, query })}
              />
            </div>
            <SearchFilterTrigger />
          </div>
          <CollapsiblePrimitive.Panel className={element}>
            <div className={container4}>
              <Select
                items={mealItems}
                multiple
                onValueChange={(meals) => setFilters({ ...filters, meals })}
                placeholder="Repas"
                title="Repas"
                value={filters.meals}
              />
            </div>
            <div className={container5}>
              <Select
                items={cuisineItems}
                multiple
                onValueChange={(cuisineTypes) => setFilters({ ...filters, cuisineTypes })}
                placeholder="Cuisines"
                title="Cuisines"
                value={filters.cuisineTypes}
              />
            </div>
            <Toggle
              presentation="filter"
              variant="outline"
              pressed={filters.isVegetarian}
              onPressedChange={(pressed) => setFilters({ ...filters, isVegetarian: pressed })}
            >
              Végétarien
            </Toggle>
            <Toggle
              presentation="filter"
              variant="outline"
              pressed={filters.isMagimix}
              onPressedChange={(pressed) => setFilters({ ...filters, isMagimix: pressed })}
            >
              Magimix
            </Toggle>
            <div className={container6}>
              <Toggle
                presentation="filter"
                variant="outline"
                pressed={filters.isSpice}
                onPressedChange={(pressed) => setFilters({ ...filters, isSpice: pressed })}
              >
                Épices
              </Toggle>
            </div>
          </CollapsiblePrimitive.Panel>
        </CollapsiblePrimitive.Root>
      </div>
      {hasActiveFilters(filters) ? <SearchResults onClearFilters={clearFilters} recipes={filtered} /> : <RecentRecipes recipes={nonSpiceRecipes} />}
    </ScreenLayout>
  )
}

const SearchSkeleton = () => (
  <ScreenLayout title="Rechercher" pageKey="/search">
    <Skeleton preset="search-input" />
    <div className={container7}>
      {incrementalArray({ length: 5 }).map((index) => (
        <Skeleton preset="search-result" key={index} />
      ))}
    </div>
  </ScreenLayout>
)

export const Route = createFileRoute('/search')({
  component: SearchPage,
  loader: async ({ context }) => {
    await context.queryClient.query({ ...getRecipeListOptions(), staleTime: 'static' })
  },
  pendingComponent: SearchSkeleton,
})
