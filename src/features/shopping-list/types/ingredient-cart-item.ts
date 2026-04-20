import { type UnitSlug } from '@/lib/db/schema/unit'
import { type IngredientCategory } from '@/types/ingredient'

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
