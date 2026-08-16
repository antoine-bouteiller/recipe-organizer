import { CarrotIcon, CowIcon, FishIcon, PackageIcon, PepperIcon } from '@phosphor-icons/react'
import { type ReactNode } from 'react'

import { type IngredientCategory } from '@/types/ingredient'

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
