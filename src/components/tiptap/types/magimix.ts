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
] as const

export type MagimixProgram = (typeof magimixProgram)[number]

export interface MagimixProgramData {
  program: MagimixProgram
  time: 'auto' | number
  temperature?: number
}

export const magimixProgramLabels: Record<MagimixProgram, string> = {
  expert: 'Expert',
  'pureed-soup': 'Soupe moulinée',
  'cream-soup': 'Soupe veloutée',
  simmer: 'Mijotage',
  'stir-fry': 'Rissolage',
  steam: 'Vapeur',
  'frozen-dessert': 'Dessert glacé',
  'crushed-ice': 'Glace pilée',
  smoothie: 'Smoothie',
  'pastry-cake': 'Pâte/Gateau',
  'beaten-egg-white': 'Blanc en neige',
  'bread-brioche': 'Pain/Brioche',
  robot: 'Robot',
}
