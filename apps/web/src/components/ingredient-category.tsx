import { CarrotIcon } from '@recipe-organizer/design-system/icons/carrot'
import { CowIcon } from '@recipe-organizer/design-system/icons/cow'
import { FishIcon } from '@recipe-organizer/design-system/icons/fish'
import { PackageIcon } from '@recipe-organizer/design-system/icons/package'
import { PepperIcon } from '@recipe-organizer/design-system/icons/pepper'
import type { IngredientCategory } from '@recipe-organizer/shared/ingredients/categories'
import type { ReactNode } from 'react'

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
