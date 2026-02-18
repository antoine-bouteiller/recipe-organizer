export const magimixProgram = [
  'expert',
  'pureed-soup',
  'cream-soup',
  'simmer',
  'stir-fry',
  'steam',
  'frozen-dessert',
  'crushed-ice',
  'smoothie',
  'pastry-cake',
  'beaten-egg-white',
  'bread-brioche',
  'robot',
  'chocolate',
  'pizza',
] as const

export type MagimixProgram = (typeof magimixProgram)[number]

export const allowedRotationSpeed = ['1A', '2A', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', 'auto'] as const

export interface MagimixProgramData {
  program: MagimixProgram
  rotationSpeed: (typeof allowedRotationSpeed)[number]
  temperature?: number
  time: number
}

export const magimixProgramLabels: Record<MagimixProgram, string> = {
  'beaten-egg-white': 'Blanc en neige',
  'bread-brioche': 'Pain/Brioche',
  chocolate: 'Chocolat',
  'cream-soup': 'Soupe veloutée',
  'crushed-ice': 'Glace pilée',
  expert: 'Expert',
  'frozen-dessert': 'Dessert glacé',
  'pastry-cake': 'Pâte/Gateau',
  pizza: 'Pizza',
  'pureed-soup': 'Soupe moulinée',
  robot: 'Robot',
  simmer: 'Mijotage',
  smoothie: 'Smoothie',
  steam: 'Vapeur',
  'stir-fry': 'Rissolage',
}
