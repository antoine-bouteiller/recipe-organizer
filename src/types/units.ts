export const units = [
  'g',
  'mL',
  'CàC',
  'CàS',
  'cube(s)',
  'bouteille(s)',
  'feuille(s)',
  'boite(s)',
  'conserver(s)',
  'cm',
] as const

export type Unit = (typeof units)[number]

export const isUnit = (unit: string | undefined | null): unit is Unit =>
  units.includes(unit as Unit)
