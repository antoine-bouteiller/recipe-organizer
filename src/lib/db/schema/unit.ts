import { z } from 'zod'

export type Dimension = 'mass' | 'volume' | 'count' | 'length'

export type UnitSlug =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'cas'
  | 'cac'
  | 'piece'
  | 'pincee'
  | 'cube'
  | 'bouteille'
  | 'feuille'
  | 'boite'
  | 'conserve'
  | 'poignee'
  | 'sachet'
  | 'cm'

export interface Unit {
  readonly slug: UnitSlug
  readonly name: string
  readonly dimension: Dimension
  readonly parent: UnitSlug | null
  readonly factor: number | null
}

/* eslint-disable id-length */
export const UNITS = {
  boite: { dimension: 'count', factor: null, name: 'boite(s)', parent: null, slug: 'boite' },
  bouteille: { dimension: 'count', factor: null, name: 'bouteille(s)', parent: null, slug: 'bouteille' },
  cac: { dimension: 'volume', factor: 5, name: 'CàC', parent: 'ml', slug: 'cac' },
  cas: { dimension: 'volume', factor: 15, name: 'CàS', parent: 'ml', slug: 'cas' },
  cm: { dimension: 'length', factor: null, name: 'cm', parent: null, slug: 'cm' },
  conserve: { dimension: 'count', factor: null, name: 'conserve(s)', parent: null, slug: 'conserve' },
  cube: { dimension: 'count', factor: null, name: 'cube(s)', parent: null, slug: 'cube' },
  feuille: { dimension: 'count', factor: null, name: 'feuille(s)', parent: null, slug: 'feuille' },
  g: { dimension: 'mass', factor: null, name: 'g', parent: null, slug: 'g' },
  kg: { dimension: 'mass', factor: 1000, name: 'kg', parent: 'g', slug: 'kg' },
  l: { dimension: 'volume', factor: 1000, name: 'L', parent: 'ml', slug: 'l' },
  ml: { dimension: 'volume', factor: null, name: 'mL', parent: null, slug: 'ml' },
  piece: { dimension: 'count', factor: null, name: 'pièce(s)', parent: null, slug: 'piece' },
  pincee: { dimension: 'count', factor: null, name: 'pincée(s)', parent: null, slug: 'pincee' },
  poignee: { dimension: 'count', factor: null, name: 'poignée(s)', parent: null, slug: 'poignee' },
  sachet: { dimension: 'count', factor: null, name: 'sachet(s)', parent: null, slug: 'sachet' },
} as const satisfies Record<UnitSlug, Unit>
/* eslint-enable id-length */

export const unitSlugSchema = z.enum(Object.keys(UNITS) as [UnitSlug, ...UnitSlug[]])

export const unitOptions: { label: string; value: UnitSlug }[] = Object.values(UNITS).map((unit) => ({
  label: unit.name,
  value: unit.slug,
}))
