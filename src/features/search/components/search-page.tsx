import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { type RecipeTag } from '@/features/recipe/utils/constants'

import { EMPTY_FILTERS, filterRecipes, hasActiveFilters } from '../utils/filter'
import { RecentRecipes } from './recent-recipes'
import { SearchFilters } from './search-filters'
import { SearchResults } from './search-results'

export const SearchPage = () => {
  const [query, setQuery] = useState(EMPTY_FILTERS.query)
  const [tags, setTags] = useState<RecipeTag[]>(EMPTY_FILTERS.tags)

  const { data: recipes } = useSuspenseQuery(getRecipeListOptions())

  const filters = { query, tags }
  const filtered = useMemo(() => filterRecipes(recipes, { query, tags }), [recipes, query, tags])

  const clearFilters = () => {
    setQuery(EMPTY_FILTERS.query)
    setTags(EMPTY_FILTERS.tags)
  }

  return (
    <ScreenLayout title="Rechercher" pageKey="/search">
      <div className="sticky top-0 z-10 flex flex-col gap-2 bg-background px-4 pt-4 pb-2">
        <SearchFilters onTagsChange={setTags} query={query} setQuery={setQuery} tags={tags} />
      </div>
      {hasActiveFilters(filters) ? <SearchResults onClearFilters={clearFilters} recipes={filtered} /> : <RecentRecipes recipes={recipes} />}
    </ScreenLayout>
  )
}
