import { type IngredientCategory } from '@recipe-organizer/shared/ingredients/categories'
import { type UnitSlug } from '@recipe-organizer/shared/units'

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
