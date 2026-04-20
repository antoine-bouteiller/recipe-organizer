import { useSuspenseQuery } from '@tanstack/react-query'

import { getRecipeByIdsOptions } from '@/features/shopping-list/api/get-recipe-by-ids'
import { type UnitSlug } from '@/lib/db/schema/unit'
import { useRecipeQuantitiesStore } from '@/stores/recipe-quantities.store'
import { type IngredientCategory } from '@/types/ingredient'
import { isNullOrUndefined } from '@/utils/is-null-or-undefined'
import { convert } from '@/utils/unit-converter'

import '@tanstack/react-start/client-only'
import { useShoppingListStore } from '../../../stores/shopping-list.store'
import { type AggregatedIngredient, type IngredientCartItem } from '../types/ingredient-cart-item'

interface RawLine {
  readonly quantity: number
  readonly unitSlug: UnitSlug | null
}

interface IngredientAccumulator {
  readonly category: IngredientCategory
  readonly countWeightG: number | null
  readonly densityGPerMl: number | null
  readonly id: number
  readonly name: string
  readonly parentId: number | null
  readonly preferredUnitSlug: UnitSlug | null
  readonly lines: RawLine[]
}

const tryConvert = (line: RawLine, targetSlug: UnitSlug | null, ingredient: IngredientAccumulator): number | null => {
  if (line.unitSlug === targetSlug) {
    return line.quantity
  }
  if (line.unitSlug === null || targetSlug === null) {
    return null
  }
  return convert(line.quantity, line.unitSlug, targetSlug, {
    countWeightG: ingredient.countWeightG,
    densityGPerMl: ingredient.densityGPerMl,
  })
}

const aggregateLines = (ingredient: IngredientAccumulator): AggregatedIngredient => {
  const targetSlug: UnitSlug | null = ingredient.preferredUnitSlug ?? ingredient.lines[0]?.unitSlug ?? null

  let primaryQuantity = 0
  const fallbackMap = new Map<UnitSlug | null, number>()

  for (const line of ingredient.lines) {
    const converted = tryConvert(line, targetSlug, ingredient)
    if (converted === null) {
      fallbackMap.set(line.unitSlug, (fallbackMap.get(line.unitSlug) ?? 0) + line.quantity)
    } else {
      primaryQuantity += converted
    }
  }

  return {
    category: ingredient.category,
    fallback: Array.from(fallbackMap, ([unitSlug, quantity]) => ({ quantity, unitSlug })),
    id: ingredient.id,
    name: ingredient.name,
    primary: { quantity: primaryQuantity, unitSlug: targetSlug },
  }
}

export const useShoppingList = () => {
  const shoppingList = useShoppingListStore((state) => state.shoppingList)
  const recipesQuantities = useRecipeQuantitiesStore((state) => state.recipesQuantities)

  const { data: recipes } = useSuspenseQuery(getRecipeByIdsOptions(shoppingList))

  const recipesWithQuantities = recipes?.map((recipe) => ({
    ...recipe,
    wantedQuantity: isNullOrUndefined(recipesQuantities[recipe.id]) ? recipe.servings : recipesQuantities[recipe.id],
  }))

  let shoppingListIngredients: Partial<Record<IngredientCategory, IngredientCartItem[]>> = {}

  if (recipesWithQuantities) {
    const ingredientsMap = new Map<number, IngredientAccumulator>()

    for (const recipe of recipesWithQuantities) {
      for (const ingredient of recipe.ingredients) {
        const scaledQty = (ingredient.quantity * recipe.wantedQuantity) / recipe.servings
        const existing = ingredientsMap.get(ingredient.id)
        if (existing) {
          existing.lines.push({ quantity: scaledQty, unitSlug: ingredient.unitSlug })
        } else {
          ingredientsMap.set(ingredient.id, {
            category: ingredient.category,
            countWeightG: ingredient.countWeightG,
            densityGPerMl: ingredient.densityGPerMl,
            id: ingredient.id,
            lines: [{ quantity: scaledQty, unitSlug: ingredient.unitSlug }],
            name: ingredient.name,
            parentId: ingredient.parentId,
            preferredUnitSlug: ingredient.preferredUnitSlug,
          })
        }
      }
    }

    const aggregatesById = new Map<number, AggregatedIngredient>()
    for (const [id, acc] of ingredientsMap) {
      aggregatesById.set(id, aggregateLines(acc))
    }

    const parentQuantities = new Map<number, number>()
    const childrenIds = new Set<number>()
    for (const acc of ingredientsMap.values()) {
      if (acc.parentId) {
        childrenIds.add(acc.id)
        const childPrimary = aggregatesById.get(acc.id)?.primary.quantity ?? 0
        const currentMax = parentQuantities.get(acc.parentId) ?? 0
        parentQuantities.set(acc.parentId, Math.max(currentMax, childPrimary))
      }
    }

    const result: AggregatedIngredient[] = [...aggregatesById]
      .filter(([id]) => !childrenIds.has(id))
      .map(([id, aggregate]) => {
        const childBonus = parentQuantities.get(id) ?? 0
        return childBonus > 0 ? { ...aggregate, primary: { ...aggregate.primary, quantity: aggregate.primary.quantity + childBonus } } : aggregate
      })

    shoppingListIngredients = result.reduce<Partial<Record<IngredientCategory, IngredientCartItem[]>>>((acc, ingredient) => {
      const key = ingredient.category
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(ingredient)
      return acc
    }, {})
  }

  return {
    recipesQuantities,
    shoppingListIngredients,
  }
}
