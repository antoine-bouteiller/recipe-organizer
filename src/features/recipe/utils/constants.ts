import { type CuisineType, type Meal } from '@schema'

export const CUISINE_TYPES = [
  'mediterranean',
  'chinese',
  'japanese',
  'indian',
  'mexican',
  'italian',
  'french',
] as const satisfies readonly CuisineType[]

export const MEALS = ['breakfast', 'lunch', 'diner', 'dessert'] as const satisfies readonly Meal[]

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
