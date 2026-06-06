export const CUISINE_TYPES = ['mediterranean', 'chinese', 'japanese', 'indian', 'mexican', 'italian', 'french'] as const

export const MEALS = ['breakfast', 'lunch', 'diner', 'dessert'] as const

export type CuisineType = (typeof CUISINE_TYPES)[number]
export type Meal = (typeof MEALS)[number]

export const CUISINE_TYPE_LABELS: Record<CuisineType, string> = {
  chinese: 'Chinois',
  french: 'Français',
  indian: 'Indien',
  italian: 'Italien',
  japanese: 'Japonais',
  mediterranean: 'Méditerranéen',
  mexican: 'Mexicain',
}

export const MEAL_LABELS: Record<Meal, string> = {
  breakfast: 'Petit-déjeuner',
  dessert: 'Dessert',
  diner: 'Dîner',
  lunch: 'Déjeuner',
}

export const VEGETARIAN_LABEL = 'Végétarien'
export const MAGIMIX_LABEL = 'Magimix'
