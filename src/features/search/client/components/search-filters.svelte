<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import Toggle from '@/components/ui/actions/toggle/toggle.svelte'
  import { FunnelSimpleIcon } from '@/components/ui/data-display/icons'
  import SearchInput from '@/components/ui/forms/search-input/search-input.svelte'
  import Select from '@/components/ui/forms/select/select.svelte'
  import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '@/features/recipe/constants'
  import type { SearchFilters } from '@/features/search/client/utils/filter'

  const cuisineItems = CUISINE_TYPES.map((cuisineType) => ({ label: CUISINE_TYPE_LABELS[cuisineType], value: cuisineType }))
  const mealItems = MEALS.map((meal) => ({ label: MEAL_LABELS[meal], value: meal }))
  const { filters, onFiltersChange }: { filters: SearchFilters; onFiltersChange: (filters: SearchFilters) => void } = $props()
  let open = $state(false)
</script>

<div class="search-filters-container">
  <div class="search-filters-search-input-row">
    <div class="search-filters-query-field">
      <SearchInput
        placeholder="Rechercher une recette, un ingrédient…"
        autoFocus
        search={filters.query}
        setSearch={(query) => onFiltersChange({ ...filters, query })}
      />
    </div>
    <Button aria-label="Filtrer par catégorie" onclick={() => (open = !open)} size="icon-lg" variant="outline"><FunnelSimpleIcon /></Button>
  </div>
  {#if open}
    <div class="search-filters-element">
      <div class="search-filters-meal-filter">
        <Select
          items={mealItems}
          onValueChange={(meal) => onFiltersChange({ ...filters, meals: meal ? [meal] : [] })}
          placeholder="Repas"
          title="Repas"
          value={filters.meals[0]}
        />
      </div>
      <div class="search-filters-cuisine-filter">
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
        onPressedChange={(isVegetarian) => onFiltersChange({ ...filters, isVegetarian })}>Végétarien</Toggle
      >
      <Toggle
        presentation="filter"
        variant="outline"
        pressed={filters.isMagimix}
        onPressedChange={(isMagimix) => onFiltersChange({ ...filters, isMagimix })}>Magimix</Toggle
      >
      <div class="search-filters-spice-filter">
        <Toggle
          presentation="filter"
          variant="outline"
          pressed={filters.isSpice}
          onPressedChange={(isSpice) => onFiltersChange({ ...filters, isSpice })}>Épices</Toggle
        >
      </div>
    </div>
  {/if}
</div>

<style>
  .search-filters-container {
    background: var(--colors-muted);
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 8px;
    position: sticky;
    top: var(--screen-header-height);
    z-index: 10;
  }

  @media screen and (min-width: 768px) {
    .search-filters-container {
      top: 0px;
    }
  }

  .search-filters-search-input-row {
    align-items: center;
    display: flex;
    gap: 8px;
  }

  .search-filters-query-field {
    flex: 1 1 0%;
  }

  .search-filters-element {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-top: 8px;
  }

  .search-filters-meal-filter {
    width: 100%;
  }

  .search-filters-cuisine-filter {
    width: 100%;
  }

  .search-filters-spice-filter {
    grid-column: span 2 / span 2;
  }
</style>
