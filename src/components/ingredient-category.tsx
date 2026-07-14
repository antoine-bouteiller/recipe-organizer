import { Fire, Fish, ForkKnife, Leaf, Package } from 'phosphor-solid'
import { type JSX } from 'solid-js'

import { type IngredientCategory } from '@/types/ingredient'

export const ingredientCategoryLabels: Record<IngredientCategory, string> = {
  fish: 'Poissons',
  meat: 'Viandes',
  other: 'Autres',
  spices: 'Epices & Condiments',
  vegetables: 'Légumes',
}

export const ingredientCategoryIcons: Record<IngredientCategory, JSX.Element> = {
  fish: <Fish />,
  meat: <ForkKnife />,
  other: <Package />,
  spices: <Fire />,
  vegetables: <Leaf />,
}

export const ingredientsCategoryOptions = Object.entries(ingredientCategoryLabels).map(([key, value]) => ({
  label: value,
  value: key,
}))
