import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'
import { type SearchFilters as SearchFiltersValue } from '@client/features/search/utils/filter'
import { Button } from '@recipe-organizer/design-system/button'
import { FunnelSimpleIcon } from '@recipe-organizer/design-system/icons/funnel-simple'
import { SearchInput } from '@recipe-organizer/design-system/search-input'
import { Select } from '@recipe-organizer/design-system/select'
import { Toggle } from '@recipe-organizer/design-system/toggle'
import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '@recipe-organizer/shared/recipe/constants'

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

export const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => (
  <div className={styles.container}>
    <CollapsiblePrimitive.Root>
      <div className={styles.searchInputRow}>
        <div className={styles.queryField}>
          <SearchInput
            placeholder="Rechercher une recette, un ingrédient…"
            autoFocus
            search={filters.query}
            setSearch={(query) => onFiltersChange({ ...filters, query })}
          />
        </div>
        <CollapsiblePrimitive.Trigger aria-label="Filtrer par catégorie" render={<Button size="icon-lg" variant="outline" />}>
          <FunnelSimpleIcon />
        </CollapsiblePrimitive.Trigger>
      </div>
      <CollapsiblePrimitive.Panel className={styles.element}>
        <div className={styles.mealFilter}>
          <Select
            items={mealItems}
            multiple
            onValueChange={(meals) => onFiltersChange({ ...filters, meals })}
            placeholder="Repas"
            title="Repas"
            value={filters.meals}
          />
        </div>
        <div className={styles.cuisineFilter}>
          <Select
            items={cuisineItems}
            multiple
            onValueChange={(cuisineTypes) => onFiltersChange({ ...filters, cuisineTypes })}
            placeholder="Cuisines"
            title="Cuisines"
            value={filters.cuisineTypes}
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
      </CollapsiblePrimitive.Panel>
    </CollapsiblePrimitive.Root>
  </div>
)
