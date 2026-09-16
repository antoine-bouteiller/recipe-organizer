import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'
import { ScreenLayout } from '@client/components/layout/screen-layout'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { RecentRecipes } from '@client/features/search/components/recent-recipes'
import { SearchFilterTrigger } from '@client/features/search/components/search-filter-trigger'
import { SearchResults } from '@client/features/search/components/search-results'
import { EMPTY_FILTERS, filterRecipes, hasActiveFilters, type SearchFilters as SearchFiltersValue } from '@client/features/search/utils/filter'
import { css } from '@recipe-organizer/design-system/css'
import { SearchInput } from '@recipe-organizer/design-system/search-input'
import { Select } from '@recipe-organizer/design-system/select'
import { Skeleton } from '@recipe-organizer/design-system/skeleton'
import { Toggle } from '@recipe-organizer/design-system/toggle'
import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '@recipe-organizer/shared/recipe/constants'
import { incrementalArray } from '@recipe-organizer/shared/utils/array'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

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
      <div
        className={css({
          background: { md: 'muted' },
          display: 'flex',
          flexDirection: 'column',
          gap: '2',
          paddingBottom: '2',
          position: 'sticky',
          top: { base: 'var(--screen-header-height)', md: '0' },
          zIndex: '10',
        })}
      >
        <CollapsiblePrimitive.Root>
          <div className={css({ alignItems: 'center', display: 'flex', gap: '2' })}>
            <div className={css({ flex: '1' })}>
              <SearchInput
                placeholder="Rechercher une recette, un ingrédient…"
                autoFocus
                search={filters.query}
                setSearch={(query) => setFilters({ ...filters, query })}
              />
            </div>
            <SearchFilterTrigger />
          </div>
          <CollapsiblePrimitive.Panel
            className={css({
              '&[data-ending-style]': { height: '0' },
              '&[data-starting-style]': { height: '0' },
              display: 'grid',
              gap: '2.5',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              height: 'var(--collapsible-panel-height)',
              overflow: 'hidden',
              paddingTop: '2',
              transitionDuration: '200ms',
              transitionProperty: 'height',
            })}
          >
            <div className={css({ width: 'full' })}>
              <Select
                items={mealItems}
                multiple
                onValueChange={(meals) => setFilters({ ...filters, meals })}
                placeholder="Repas"
                title="Repas"
                value={filters.meals}
              />
            </div>
            <div className={css({ width: 'full' })}>
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
            <div className={css({ gridColumn: 'span 2 / span 2' })}>
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
    <div className={css({ display: 'flex', flex: '1', flexDirection: 'column', gap: '2.5', paddingTop: '2' })}>
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
