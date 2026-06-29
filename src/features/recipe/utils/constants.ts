import { type CuisineType, type Meal } from '@/types/recipe'

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
export const SPICE_LABEL = 'Épices'
