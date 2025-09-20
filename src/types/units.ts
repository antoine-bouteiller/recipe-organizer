export const units = [
  'g',
  'mL',
  'cL',
  'CàC',
  'CàS',
  'cube(s)',
  'bouteille(s)',
  'feuille(s)',
  'boite(s)',
] as const

export type Unit = (typeof units)[number]

export const isUnit = (unit: string | undefined | null): unit is Unit =>
  units.includes(unit as Unit)
