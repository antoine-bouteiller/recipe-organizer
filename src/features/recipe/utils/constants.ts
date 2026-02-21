export const RECIPE_TAGS = ['dessert', 'mediterranean', 'chinese', 'japanese', 'indian', 'mexican', 'italian', 'french'] as const

export type RecipeTag = (typeof RECIPE_TAGS)[number] | (typeof AUTO_TAGS)[number]

export const RECIPE_TAG_LABELS: Record<RecipeTag, string> = {
  chinese: 'Chinois',
  dessert: 'Dessert',
  french: 'Français',
  indian: 'Indien',
  italian: 'Italien',
  japanese: 'Japonais',
  magimix: 'Magimix',
  mediterranean: 'Méditerranéen',
  mexican: 'Mexicain',
  vegetarian: 'Végétarien',
}

export const AUTO_TAGS = ['vegetarian', 'magimix'] as const
