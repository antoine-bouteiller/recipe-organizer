import type { SearchFilters as SearchFiltersValue } from '@client/features/search/utils/filter'
import { Button } from '@recipe-organizer/design-system/button'
import { FunnelSimpleIcon } from '@recipe-organizer/design-system/icons'
import { SearchInput } from '@recipe-organizer/design-system/search-input'
import { Select } from '@recipe-organizer/design-system/select'
import { Toggle } from '@recipe-organizer/design-system/toggle'
import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '@recipe-organizer/shared/recipe/constants'
import { useState } from 'react'

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
