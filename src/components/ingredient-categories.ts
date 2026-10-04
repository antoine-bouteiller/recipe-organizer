import type { Component } from 'svelte'

import { CarrotIcon, CowIcon, FishIcon, PackageIcon, PepperIcon } from '@/components/ui/data-display/icons'
import type { IconProps } from '@/components/ui/data-display/icons/icon-types'
import type { IngredientCategory } from '@/features/ingredients/categories'

export const ingredientCategoryLabels = {
  fish: 'Poissons',
  meat: 'Viandes',
  other: 'Autres',
  spices: 'Epices & Condiments',
  vegetables: 'Légumes',
} satisfies Record<IngredientCategory, string>

export const ingredientCategoryIcons = {
  fish: FishIcon,
  meat: CowIcon,
  other: PackageIcon,
  spices: PepperIcon,
  vegetables: CarrotIcon,
} satisfies Record<IngredientCategory, Component<IconProps>>

export const ingredientsCategoryOptions = Object.entries(ingredientCategoryLabels).map(([key, value]) => ({
  label: value,
  value: key,
}))
