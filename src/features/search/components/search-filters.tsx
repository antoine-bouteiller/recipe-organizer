import { FunnelSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'

import { ToggleGroup } from '@/components/common/toggle-group'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { MAGIMIX_LABEL, VEGETARIAN_LABEL } from '@/features/recipe/utils/constants'

import { hasActiveFilters, type SearchFilters as SearchFiltersValue } from '../utils/filter'
import { CategorySelect } from './category-select'

const flagItems = [
  { label: VEGETARIAN_LABEL, value: 'isVegetarian' },
  { label: MAGIMIX_LABEL, value: 'isMagimix' },
]

interface SearchFiltersProps {
  filters: SearchFiltersValue
  onFiltersChange: (filters: SearchFiltersValue) => void
}

export const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const [open, setOpen] = useState(false)

  const activeFlags = [filters.isVegetarian ? 'isVegetarian' : null, filters.isMagimix ? 'isMagimix' : null].filter((flag) => flag !== null)
  const hasFilters = hasActiveFilters({ ...filters, query: '' })

  const handleFlagsChange = (flags: string[]) =>
    onFiltersChange({ ...filters, isMagimix: flags.includes('isMagimix'), isVegetarian: flags.includes('isVegetarian') })

  return (
    <Collapsible onOpenChange={setOpen} open={open}>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchInput autoFocus search={filters.query} setSearch={(query) => onFiltersChange({ ...filters, query })} />
        </div>
        <CollapsibleTrigger render={<Button aria-label="Filtrer par catégorie" size="icon-lg" variant={hasFilters ? 'default' : 'outline'} />}>
          <FunnelSimpleIcon />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-wrap items-center gap-2 pt-2">
        <CategorySelect
          cuisineTypes={filters.cuisineTypes}
          meals={filters.meals}
          onCuisineTypesChange={(cuisineTypes) => onFiltersChange({ ...filters, cuisineTypes })}
          onMealsChange={(meals) => onFiltersChange({ ...filters, meals })}
        />
        <ToggleGroup items={flagItems} onValueChange={handleFlagsChange} value={activeFlags} />
      </CollapsibleContent>
    </Collapsible>
  )
}
