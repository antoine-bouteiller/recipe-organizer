import { useState } from 'react'

import { Button } from '@/components/ui/actions/button/button'
import { Toggle } from '@/components/ui/actions/toggle/toggle'
import { FunnelSimpleIcon } from '@/components/ui/data-display/icons'
import { SearchInput } from '@/components/ui/forms/search-input/search-input'
import { Select } from '@/components/ui/forms/select/select'
import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '@/features/recipe/constants'
import type { SearchFilters as SearchFiltersValue } from '@/features/search/client/utils/filter'

import * as styles from './search-filters.css'

const cuisineItems = CUISINE_TYPES.map((cuisineType) => ({
  label: CUISINE_TYPE_LABELS[cuisineType],
  value: cuisineType,
}))

const mealItems = MEALS.map((meal) => ({
  label: MEAL_LABELS[meal],
  value: meal,
}))

export interface SearchFiltersProps {
  filters: SearchFiltersValue
  onFiltersChange: (filters: SearchFiltersValue) => void
}

export const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.container}>
      <div className={styles.searchInputRow}>
        <div className={styles.queryField}>
          <SearchInput
            placeholder="Rechercher une recette, un ingrédient…"
            autoFocus
            search={filters.query}
            setSearch={(query) => onFiltersChange({ ...filters, query })}
          />
        </div>
        <Button aria-label="Filtrer par catégorie" onClick={() => setOpen(!open)} size="icon-lg" variant="outline">
          <FunnelSimpleIcon />
        </Button>
      </div>
      {open && (
        <div className={styles.element}>
          <div className={styles.mealFilter}>
            <Select
              items={mealItems}
              onValueChange={(meal) => onFiltersChange({ ...filters, meals: meal ? [meal] : [] })}
              placeholder="Repas"
              title="Repas"
              value={filters.meals[0]}
            />
          </div>
          <div className={styles.cuisineFilter}>
            <Select
              items={cuisineItems}
              onValueChange={(cuisineType) => onFiltersChange({ ...filters, cuisineTypes: cuisineType ? [cuisineType] : [] })}
              placeholder="Cuisines"
              title="Cuisines"
              value={filters.cuisineTypes[0]}
            />
          </div>
          <Toggle
            presentation="filter"
            variant="outline"
            pressed={filters.isVegetarian}
            onPressedChange={(isVegetarian) => onFiltersChange({ ...filters, isVegetarian })}
          >
            Végétarien
          </Toggle>
          <Toggle
            presentation="filter"
            variant="outline"
            pressed={filters.isMagimix}
            onPressedChange={(isMagimix) => onFiltersChange({ ...filters, isMagimix })}
          >
            Magimix
          </Toggle>
          <div className={styles.spiceFilter}>
            <Toggle
              presentation="filter"
              variant="outline"
              pressed={filters.isSpice}
              onPressedChange={(isSpice) => onFiltersChange({ ...filters, isSpice })}
            >
              Épices
            </Toggle>
          </div>
        </div>
      )}
    </div>
  )
}
