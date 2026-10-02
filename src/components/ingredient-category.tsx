import type { ReactNode } from 'react'

import { CarrotIcon, CowIcon, FishIcon, PackageIcon, PepperIcon } from '@/design-system/ui/data-display/icons'
import type { IngredientCategory } from '@/features/ingredients/categories'

export const ingredientCategoryLabels = {
  fish: 'Poissons',
  meat: 'Viandes',
  other: 'Autres',
  spices: 'Epices & Condiments',
  vegetables: 'Légumes',
} satisfies Record<IngredientCategory, string>

export const ingredientCategoryIcons = {
  fish: <FishIcon />,
  meat: <CowIcon />,
  other: <PackageIcon />,
  spices: <PepperIcon />,
  vegetables: <CarrotIcon />,
} satisfies Record<IngredientCategory, ReactNode>

export const ingredientsCategoryOptions = Object.entries(ingredientCategoryLabels).map(([key, value]) => ({
  label: value,
  value: key,
}))
