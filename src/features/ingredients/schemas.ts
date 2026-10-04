import * as z from 'zod'

import { ingredientCategory } from '@/features/ingredients/categories'
import { unitSlugSchema } from '@/utils/unit-slug-schema'

export const ingredientSchema = z.object({
  category: z.enum(ingredientCategory),
  countWeightG: z.number().min(0).nullable().optional(),
  densityGPerMl: z.number().min(0).nullable().optional(),
  name: z.string().min(2),
  parentId: z.number().optional(),
  preferredUnitSlug: unitSlugSchema.nullable().optional(),
})

export const updateIngredientSchema = ingredientSchema.extend({ id: z.number() })
export const deleteIngredientSchema = z.object({ id: z.number() })

type IngredientFormValues = z.infer<typeof ingredientSchema>
export type IngredientFormInput = Partial<IngredientFormValues>
