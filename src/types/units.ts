export const units = ['kg', 'g', 'l', 'ml', 'CàC', 'CàS'] as const

export type Unit = (typeof units)[number]
