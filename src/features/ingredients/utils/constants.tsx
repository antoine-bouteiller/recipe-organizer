import { CarrotIcon, CowIcon, FishIcon, PackageIcon, PepperIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

import type { IngredientCategory } from '@/types/ingredient'

export const ingredientCategoryLabels: Record<IngredientCategory, string> = {
  fish: 'Poissons',
  meat: 'Viandes',
  other: 'Autres',
  spices: 'Epices & Condiments',
  vegetables: 'Légumes',
}

export const ingredientCategoryIcons: Record<IngredientCategory, ReactNode> = {
  fish: <FishIcon />,
  meat: <CowIcon />,
  other: <PackageIcon />,
  spices: <PepperIcon />,
  vegetables: <CarrotIcon />,
}

export const ingredientsCategoryOptions = Object.entries(ingredientCategoryLabels).map(([key, value]) => ({
  label: value,
  value: key,
}))
