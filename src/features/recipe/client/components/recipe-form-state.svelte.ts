import type { RecipeFormInput } from '@/features/recipe/schemas'

/** Controlled immutable fields; the page adapts setData to the app form's mutable data. */
export interface RecipeFormState {
  data: RecipeFormInput
  setData: <TKey extends keyof RecipeFormInput>(key: TKey, value: RecipeFormInput[TKey]) => void
  pending: boolean
}
