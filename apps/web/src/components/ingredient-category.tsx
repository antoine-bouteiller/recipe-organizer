import { CarrotIcon } from '@client/components/icons/carrot'
import { CowIcon } from '@client/components/icons/cow'
import { FishIcon } from '@client/components/icons/fish'
import { PackageIcon } from '@client/components/icons/package'
import { PepperIcon } from '@client/components/icons/pepper'
import { type IngredientCategory } from '@recipe-organizer/shared/ingredients/categories'
import { type ReactNode } from 'react'

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
