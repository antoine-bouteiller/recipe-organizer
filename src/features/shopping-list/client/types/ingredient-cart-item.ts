import type { IngredientCategory } from '@/features/ingredients/categories'
import type { UnitSlug } from '@/utils/units'

export interface AggregatedIngredient {
  readonly category: IngredientCategory
  readonly id: number
  readonly name: string
  readonly primary: {
    readonly quantity: number
    readonly unitSlug: UnitSlug | null
  }
  readonly fallback: readonly {
    readonly quantity: number
    readonly unitSlug: UnitSlug | null
  }[]
}

export type IngredientCartItem = AggregatedIngredient
