import { Select } from '@/components/common/select'
import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS, type CuisineType, type Meal } from '@/features/recipe/utils/constants'

const cuisineItems = CUISINE_TYPES.map((cuisineType) => ({
  label: CUISINE_TYPE_LABELS[cuisineType],
  value: cuisineType,
}))

const mealItems = MEALS.map((meal) => ({
  label: MEAL_LABELS[meal],
  value: meal,
}))

interface CategorySelectProps {
  cuisineTypes: CuisineType[]
  meals: Meal[]
  onCuisineTypesChange: (cuisineTypes: CuisineType[]) => void
  onMealsChange: (meals: Meal[]) => void
}

export const CategorySelect = ({ cuisineTypes, meals, onCuisineTypesChange, onMealsChange }: CategorySelectProps) => (
  <>
    <Select items={mealItems} multiple onValueChange={onMealsChange} placeholder="Repas" title="Repas" value={meals} />
    <Select items={cuisineItems} multiple onValueChange={onCuisineTypesChange} placeholder="Cuisines" title="Cuisines" value={cuisineTypes} />
  </>
)
