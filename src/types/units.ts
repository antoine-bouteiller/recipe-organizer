export const units = [
  'g',
  'kg',
  'mL',
  'L',
  'CàC',
  'CàS',
  'cube(s)',
  'bouteille(s)',
  'feuille(s)',
] as const

export type Unit = (typeof units)[number]
