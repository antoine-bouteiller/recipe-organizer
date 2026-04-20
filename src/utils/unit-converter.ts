import { UNITS, type Dimension, type Unit, type UnitSlug } from '@/lib/db/schema/unit'

interface IngredientConversionMeta {
  readonly densityGPerMl: number | null
  readonly countWeightG: number | null
}

const MAX_CHAIN_DEPTH = 16

const isValidFactor = (factor: number | null): factor is number => factor !== null && Number.isFinite(factor) && factor > 0

const isPositive = (value: number | null): value is number => value !== null && Number.isFinite(value) && value > 0

const toCanonicalBase = (quantity: number, slug: UnitSlug): { value: number; dimension: Dimension } | null => {
  const start = UNITS[slug]
  if (start === undefined) {
    return null
  }

  let currentUnit: Unit = start
  let value = quantity

  for (let depth = 0; depth < MAX_CHAIN_DEPTH; depth += 1) {
    if (currentUnit.parent === null) {
      return { dimension: currentUnit.dimension, value }
    }

    if (!isValidFactor(currentUnit.factor)) {
      return null
    }

    const parent = UNITS[currentUnit.parent]
    if (parent === undefined) {
      return null
    }
    if (parent.dimension !== currentUnit.dimension) {
      return null
    }

    value *= currentUnit.factor
    currentUnit = parent
  }

  return null
}

const fromCanonicalBase = (quantity: number, targetSlug: UnitSlug): number | null => {
  const target = UNITS[targetSlug]
  if (target === undefined) {
    return null
  }

  const chain: Unit[] = []
  let currentUnit: Unit = target
  let reachedBase = false

  for (let depth = 0; depth < MAX_CHAIN_DEPTH; depth += 1) {
    chain.push(currentUnit)
    if (currentUnit.parent === null) {
      reachedBase = true
      break
    }

    if (!isValidFactor(currentUnit.factor)) {
      return null
    }
    const parent = UNITS[currentUnit.parent]
    if (parent === undefined) {
      return null
    }
    if (parent.dimension !== currentUnit.dimension) {
      return null
    }

    currentUnit = parent
  }

  if (!reachedBase) {
    return null
  }

  let value = quantity
  for (let hopIndex = chain.length - 1; hopIndex >= 0; hopIndex -= 1) {
    const hop = chain[hopIndex]
    if (hop.parent !== null) {
      if (!isValidFactor(hop.factor)) {
        return null
      }
      value /= hop.factor
    }
  }
  return value
}

const toGrams = (value: number, from: Dimension, ingredient: IngredientConversionMeta): number | null => {
  if (from === 'mass') {
    return value
  }
  if (from === 'volume') {
    return isPositive(ingredient.densityGPerMl) ? value * ingredient.densityGPerMl : null
  }
  if (from === 'count') {
    return isPositive(ingredient.countWeightG) ? value * ingredient.countWeightG : null
  }
  return null
}

const fromGrams = (value: number, to: Dimension, ingredient: IngredientConversionMeta): number | null => {
  if (to === 'mass') {
    return value
  }
  if (to === 'volume') {
    return isPositive(ingredient.densityGPerMl) ? value / ingredient.densityGPerMl : null
  }
  if (to === 'count') {
    return isPositive(ingredient.countWeightG) ? value / ingredient.countWeightG : null
  }
  return null
}

const bridgeDimensions = (value: number, from: Dimension, to: Dimension, ingredient: IngredientConversionMeta): number | null => {
  if (from === to) {
    return value
  }
  const inGrams = toGrams(value, from, ingredient)
  if (inGrams === null) {
    return null
  }
  return fromGrams(inGrams, to, ingredient)
}

export const convert = (quantity: number, fromSlug: UnitSlug, toSlug: UnitSlug, ingredient: IngredientConversionMeta): number | null => {
  if (!Number.isFinite(quantity)) {
    return null
  }
  if (fromSlug === toSlug) {
    return UNITS[fromSlug] === undefined ? null : quantity
  }

  const canonical = toCanonicalBase(quantity, fromSlug)
  if (canonical === null) {
    return null
  }

  const target = UNITS[toSlug]
  if (target === undefined) {
    return null
  }

  const bridged = bridgeDimensions(canonical.value, canonical.dimension, target.dimension, ingredient)
  if (bridged === null) {
    return null
  }

  return fromCanonicalBase(bridged, toSlug)
}
