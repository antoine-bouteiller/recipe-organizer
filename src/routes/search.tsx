import { Collapsible } from '@kobalte/core/collapsible'
import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { createMemo, createSignal, Show } from 'solid-js'
import FunnelSimple from '~icons/ph/funnel-simple'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Toggle } from '@/components/ui/toggle'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '@/features/recipe/utils/constants'
import { RecentRecipes } from '@/features/search/components/recent-recipes'
import { SearchResults } from '@/features/search/components/search-results'
import { EMPTY_FILTERS, filterRecipes, hasActiveFilters, type SearchFilters as SearchFiltersValue } from '@/features/search/utils/filter'

const cuisineItems = CUISINE_TYPES.map((cuisineType) => ({
  label: CUISINE_TYPE_LABELS[cuisineType],
  value: cuisineType,
}))

const mealItems = MEALS.map((meal) => ({
  label: MEAL_LABELS[meal],
  value: meal,
}))

const SearchPage = () => {
  const [filters, setFilters] = createSignal<SearchFiltersValue>(EMPTY_FILTERS)

  const recipesQuery = useQuery(() => getRecipeListOptions())

  const filtered = createMemo(() => filterRecipes(recipesQuery.data ?? [], filters()))
  const nonSpiceRecipes = createMemo(() => (recipesQuery.data ?? []).filter((recipe) => !recipe.isSpice))

  const clearFilters = () => setFilters(EMPTY_FILTERS)

  return (
    <ScreenLayout pageKey="/search" title="Rechercher">
      <div class="sticky top-0 z-10 flex flex-col gap-2 bg-muted pb-2">
        <Collapsible>
          <div class="flex items-center gap-2">
            <div class="flex-1">
              <SearchInput autofocus search={filters().query} setSearch={(query) => setFilters({ ...filters(), query })} />
            </div>
            <Collapsible.Trigger aria-label="Filtrer par catégorie" as={Button} size="icon-lg" variant="outline">
              <FunnelSimple />
            </Collapsible.Trigger>
          </div>
          <Collapsible.Content class="grid grid-cols-2 gap-2.5 overflow-hidden pt-2 transition-[height] duration-200 data-closed:h-0 data-expanded:h-[var(--kb-collapsible-content-height)]">
            <Select
              class="w-full"
              items={mealItems}
              multiple
              onValueChange={(meals) => setFilters({ ...filters(), meals })}
              placeholder="Repas"
              title="Repas"
              value={filters().meals}
            />
            <Select
              class="w-full"
              items={cuisineItems}
              multiple
              onValueChange={(cuisineTypes) => setFilters({ ...filters(), cuisineTypes })}
              placeholder="Cuisines"
              title="Cuisines"
              value={filters().cuisineTypes}
            />
            <Toggle
              class="w-full justify-center data-pressed:border-primary data-pressed:bg-primary data-pressed:text-white"
              onChange={(pressed) => setFilters({ ...filters(), isVegetarian: pressed })}
              pressed={filters().isVegetarian}
              variant="outline"
            >
              Végétarien
            </Toggle>
            <Toggle
              class="w-full justify-center data-pressed:border-primary data-pressed:bg-primary data-pressed:text-white"
              onChange={(pressed) => setFilters({ ...filters(), isMagimix: pressed })}
              pressed={filters().isMagimix}
              variant="outline"
            >
              Magimix
            </Toggle>
            <Toggle
              class="col-span-2 w-full justify-center data-pressed:border-primary data-pressed:bg-primary data-pressed:text-white"
              onChange={(pressed) => setFilters({ ...filters(), isSpice: pressed })}
              pressed={filters().isSpice}
              variant="outline"
            >
              Épices
            </Toggle>
          </Collapsible.Content>
        </Collapsible>
      </div>
      <Show when={hasActiveFilters(filters())} fallback={<RecentRecipes recipes={nonSpiceRecipes()} />}>
        <SearchResults onClearFilters={clearFilters} recipes={filtered()} />
      </Show>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/search')({
  component: SearchPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRecipeListOptions())
  },
  ssr: 'data-only',
})
