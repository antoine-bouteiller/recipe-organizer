export enum MagimixProgram {
  COOKING = 'cooking',
  MIXING = 'mixing',
  KNEADING = 'kneading',
  EMULSIFYING = 'emulsifying',
  CHOPPING = 'chopping',
  BLENDING = 'blending',
  STEAMING = 'steaming',
  SIMMERING = 'simmering',
  SLOW_COOKING = 'slow_cooking',
  KEEP_WARM = 'keep_warm',
}

export interface MagimixProgramData {
  program: MagimixProgram
  time: 'auto' | number // number in seconds
  temperature?: number // temperature in celsius
}

export const magimixProgramLabels: Record<MagimixProgram, string> = {
  [MagimixProgram.COOKING]: 'Cuisson',
  [MagimixProgram.MIXING]: 'Mélange',
  [MagimixProgram.KNEADING]: 'Pétrissage',
  [MagimixProgram.EMULSIFYING]: 'Émulsion',
  [MagimixProgram.CHOPPING]: 'Hachage',
  [MagimixProgram.BLENDING]: 'Mixage',
  [MagimixProgram.STEAMING]: 'Cuisson vapeur',
  [MagimixProgram.SIMMERING]: 'Mijotage',
  [MagimixProgram.SLOW_COOKING]: 'Cuisson lente',
  [MagimixProgram.KEEP_WARM]: 'Maintien au chaud',
}
