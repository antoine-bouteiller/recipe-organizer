import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'
import { FunnelSimpleIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Toggle } from '@/components/ui/toggle'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '@/features/recipe/utils/constants'
import { RecentRecipes } from '@/features/search/components/recent-recipes'
import { SearchResults } from '@/features/search/components/search-results'
import { EMPTY_FILTERS, filterRecipes, hasActiveFilters, type SearchFilters as SearchFiltersValue } from '@/features/search/utils/filter'
import { incrementalArray } from '@/utils/array'

const cuisineItems = CUISINE_TYPES.map((cuisineType) => ({
  label: CUISINE_TYPE_LABELS[cuisineType],
  value: cuisineType,
}))

const mealItems = MEALS.map((meal) => ({
  label: MEAL_LABELS[meal],
  value: meal,
}))

const toggleClassName = 'w-full justify-center data-pressed:border-primary data-pressed:bg-primary data-pressed:text-primary-foreground'

const SearchPage = () => {
  const [filters, setFilters] = useState<SearchFiltersValue>(EMPTY_FILTERS)

  const { data: recipes } = useSuspenseQuery(getRecipeListOptions())

  const filtered = useMemo(() => filterRecipes(recipes, filters), [recipes, filters])
  const nonSpiceRecipes = useMemo(() => recipes.filter((recipe) => !recipe.isSpice), [recipes])

  const clearFilters = () => setFilters(EMPTY_FILTERS)

  return (
    <ScreenLayout title="Rechercher" pageKey="/search">
      <div className="sticky top-(--screen-header-height) z-10 flex flex-col gap-2 pb-2 md:top-0 md:bg-muted">
        <CollapsiblePrimitive.Root>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchInput autoFocus search={filters.query} setSearch={(query) => setFilters({ ...filters, query })} />
            </div>
            <CollapsiblePrimitive.Trigger render={<Button aria-label="Filtrer par catégorie" size="icon-lg" variant="outline" />}>
              <FunnelSimpleIcon />
            </CollapsiblePrimitive.Trigger>
          </div>
          <CollapsiblePrimitive.Panel className="grid h-(--collapsible-panel-height) grid-cols-2 gap-2.5 overflow-hidden pt-2 transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0">
            <Select
              items={mealItems}
              multiple
              onValueChange={(meals) => setFilters({ ...filters, meals })}
              placeholder="Repas"
              title="Repas"
              value={filters.meals}
              className="w-full"
            />
            <Select
              items={cuisineItems}
              multiple
              onValueChange={(cuisineTypes) => setFilters({ ...filters, cuisineTypes })}
              placeholder="Cuisines"
              title="Cuisines"
              value={filters.cuisineTypes}
              className="w-full"
            />
            <Toggle
              variant="outline"
              className={toggleClassName}
              pressed={filters.isVegetarian}
              onPressedChange={(pressed) => setFilters({ ...filters, isVegetarian: pressed })}
            >
              Végétarien
            </Toggle>
            <Toggle
              variant="outline"
              className={toggleClassName}
              pressed={filters.isMagimix}
              onPressedChange={(pressed) => setFilters({ ...filters, isMagimix: pressed })}
            >
              Magimix
            </Toggle>
            <Toggle
              variant="outline"
              className={`col-span-2 ${toggleClassName}`}
              pressed={filters.isSpice}
              onPressedChange={(pressed) => setFilters({ ...filters, isSpice: pressed })}
            >
              Épices
            </Toggle>
          </CollapsiblePrimitive.Panel>
        </CollapsiblePrimitive.Root>
      </div>
      {hasActiveFilters(filters) ? <SearchResults onClearFilters={clearFilters} recipes={filtered} /> : <RecentRecipes recipes={nonSpiceRecipes} />}
    </ScreenLayout>
  )
}

const SearchSkeleton = () => (
  <ScreenLayout title="Rechercher" pageKey="/search">
    <Skeleton className="h-11 w-full rounded-xl" />
    <div className="flex flex-1 flex-col gap-2.5 pt-2">
      {incrementalArray({ length: 5 }).map((index) => (
        <Skeleton className="h-20 w-full rounded-2xl" key={index} />
      ))}
    </div>
  </ScreenLayout>
)

export const Route = createFileRoute('/search')({
  component: SearchPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRecipeListOptions())
  },
  pendingComponent: SearchSkeleton,
  ssr: 'data-only',
})
