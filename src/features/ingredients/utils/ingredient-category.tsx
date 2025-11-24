import type { IngredientCategory } from '@/types/ingredient'
import { CarrotIcon, CowIcon, PackageIcon, PepperIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

export const ingredientCategoryLabels: Record<IngredientCategory, string> = {
  meat: 'Viandes',
  other: 'Autres',
  spices: 'Epices',
  vegetables: 'Légumes',
}

export const ingredientCategoryIcons: Record<IngredientCategory, ReactNode> = {
  meat: <CowIcon />,
  other: <PackageIcon />,
  spices: <PepperIcon />,
  vegetables: <CarrotIcon />,
}

export const ingredientsCategoryOptions = Object.entries(ingredientCategoryLabels).map(
  ([key, value]) => ({
    label: value,
    value: key,
  })
)
