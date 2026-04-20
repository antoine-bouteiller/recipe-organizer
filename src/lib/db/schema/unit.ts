import { z } from 'zod'

export type Dimension = 'mass' | 'volume' | 'count' | 'length'

export type UnitSlug =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'tbsp'
  | 'tsp'
  | 'piece'
  | 'pinch'
  | 'cube'
  | 'bottle'
  | 'sheet'
  | 'box'
  | 'can'
  | 'handful'
  | 'packet'
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
  bottle: { dimension: 'count', factor: null, name: 'bottle(s)', parent: null, slug: 'bottle' },
  box: { dimension: 'count', factor: null, name: 'box(es)', parent: null, slug: 'box' },
  can: { dimension: 'count', factor: null, name: 'can(s)', parent: null, slug: 'can' },
  cm: { dimension: 'length', factor: null, name: 'cm', parent: null, slug: 'cm' },
  cube: { dimension: 'count', factor: null, name: 'cube(s)', parent: null, slug: 'cube' },
  g: { dimension: 'mass', factor: null, name: 'g', parent: null, slug: 'g' },
  handful: { dimension: 'count', factor: null, name: 'handful(s)', parent: null, slug: 'handful' },
  kg: { dimension: 'mass', factor: 1000, name: 'kg', parent: 'g', slug: 'kg' },
  l: { dimension: 'volume', factor: 1000, name: 'L', parent: 'ml', slug: 'l' },
  ml: { dimension: 'volume', factor: null, name: 'mL', parent: null, slug: 'ml' },
  packet: { dimension: 'count', factor: null, name: 'packet(s)', parent: null, slug: 'packet' },
  piece: { dimension: 'count', factor: null, name: 'piece(s)', parent: null, slug: 'piece' },
  pinch: { dimension: 'count', factor: null, name: 'pinch(es)', parent: null, slug: 'pinch' },
  sheet: { dimension: 'count', factor: null, name: 'sheet(s)', parent: null, slug: 'sheet' },
  tbsp: { dimension: 'volume', factor: 15, name: 'tbsp', parent: 'ml', slug: 'tbsp' },
  tsp: { dimension: 'volume', factor: 5, name: 'tsp', parent: 'ml', slug: 'tsp' },
} as const satisfies Record<UnitSlug, Unit>
/* eslint-enable id-length */

export const unitSlugSchema = z.enum(Object.keys(UNITS) as [UnitSlug, ...UnitSlug[]])

export const unitOptions: { label: string; value: UnitSlug }[] = Object.values(UNITS).map((unit) => ({
  label: unit.name,
  value: unit.slug,
}))
