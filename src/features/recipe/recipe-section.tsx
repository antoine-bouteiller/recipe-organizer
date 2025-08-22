import { NumberField } from '@/components/forms/number-field'
import { SearchSelectField } from '@/components/forms/search-select-field'
import { TextField } from '@/components/forms/text-field'
import { Button } from '@/components/ui/button'
import { getAllIngredientsQueryOptions } from '@/features/ingredients/api/get-all'
import type { RecipeFormInput, RecipeFormValues } from '@/features/recipe/api/create-one'
import { units } from '@/types/units'
import { useQuery } from '@tanstack/react-query'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useFieldArray } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'

interface RecipeSectionProps {
  form: UseFormReturn<RecipeFormInput, unknown, RecipeFormValues>
  index: number
  canAddName?: boolean
  onDelete?: () => void
}

const unitsOptions = units.map((unit) => ({
  label: unit,
  value: unit,
}))

export default function RecipeSection({
  form,
  index,
  canAddName = true,
  onDelete,
}: RecipeSectionProps) {
  const { control } = form

  const { data: ingredients } = useQuery(getAllIngredientsQueryOptions())

  const ingredientsOptions = useMemo(
    () =>
      ingredients?.map((ingredient) => ({
        label: ingredient.name,
        value: ingredient.id.toString(),
      })) ?? [],
    [ingredients]
  )

  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${index}.ingredients`,
  })

  const withSubrecipe = form.watch(`sections.${index}.recipeId`) !== undefined

  return (
    <div className="p-4 border rounded-xl relative">
      {onDelete && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onDelete}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      )}
      {canAddName && (
        <div className="flex items-center gap-2">
          <TextField control={form.control} name={`sections.${index}.name`} label="Nom" />
        </div>
      )}
      {withSubrecipe ? (
        <div />
      ) : (
        <div className="flex flex-col gap-2 pt-2">
          {fields.map((field, ingredientIndex) => (
            <div key={field.id} className="flex w-full items-start justify-between gap-2">
              <SearchSelectField
                control={form.control}
                name={`sections.${index}.ingredients.${ingredientIndex}.id`}
                options={ingredientsOptions}
              />
              <NumberField
                control={form.control}
                name={`sections.${index}.ingredients.${ingredientIndex}.quantity`}
                min={0}
                decimalScale={1}
              />
              <SearchSelectField
                control={form.control}
                name={`sections.${index}.ingredients.${ingredientIndex}.unit`}
                options={unitsOptions}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(ingredientIndex)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              append({
                id: undefined,
                quantity: 0,
                unit: undefined,
              })
            }}
            size="sm"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
