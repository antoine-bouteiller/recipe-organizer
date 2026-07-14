import { type JSX } from 'solid-js'
import Fire from '~icons/ph/fire'
import Fish from '~icons/ph/fish'
import ForkKnife from '~icons/ph/fork-knife'
import Leaf from '~icons/ph/leaf'
import Package from '~icons/ph/package'

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
