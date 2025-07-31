export const units = ['kg', 'l', 'CàC', 'CàS'] as const

export type Unit = (typeof units)[number]
