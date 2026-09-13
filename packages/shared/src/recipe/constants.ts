export const CUISINE_TYPES = ['mediterranean', 'chinese', 'japanese', 'indian', 'mexican', 'italian', 'french'] as const

export type CuisineType = (typeof CUISINE_TYPES)[number]

export const MEALS = ['breakfast', 'lunch', 'diner', 'dessert'] as const

export type Meal = (typeof MEALS)[number]

export const CUISINE_TYPE_LABELS = {
  chinese: 'Chinois',
  french: 'Français',
  indian: 'Indien',
  italian: 'Italien',
  japanese: 'Japonais',
  mediterranean: 'Méditerranéen',
  mexican: 'Mexicain',
} satisfies Record<CuisineType, string>

export const MEAL_LABELS = {
  breakfast: 'Petit-déjeuner',
  dessert: 'Dessert',
  diner: 'Dîner',
  lunch: 'Déjeuner',
} satisfies Record<Meal, string>

export const VEGETARIAN_LABEL = 'Végétarien'
export const MAGIMIX_LABEL = 'Magimix'
export const SPICE_LABEL = 'Épices'
