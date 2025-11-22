import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { AddIngredient } from '@/features/ingredients/components/add-ingredient'
import { AddUnit } from '@/features/units/add-unit'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { withForm } from '@/hooks/use-app-form'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useStore } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { recipeDefaultValues } from '../constants'

interface IngredientFormProps {
  sectionIndex: number
}

export const IngredientSectionField = withForm({
  defaultValues: recipeDefaultValues,
  props: {} as IngredientFormProps,
  render: function Render({ form, sectionIndex }) {
    const { AppField } = form
    const { data: ingredients } = useQuery(getIngredientListOptions())
    const { data: units } = useQuery(getUnitsListOptions())

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    const ingredientsOptions = useMemo(
      () =>
        ingredients?.map((ingredient) => ({
          label: ingredient.name,
          value: ingredient.id.toString(),
        })) ?? [],
      [ingredients]
    )

    const unitsOptions = useMemo(
      () =>
        units?.map((unit) => ({
          label: unit.symbol,
          value: unit.id.toString(),
        })) ?? [],
      [units]
    )

    return (
      <AppField name={`sections[${sectionIndex}].ingredients`} mode="array">
        {(field) => (
          <div className="flex flex-col gap-2 pt-2 w-full">
            {field.state.value?.map((ingredient, ingredientIndex) => (
              <Fragment
                key={`ingredient-s${sectionIndex}-i${ingredientIndex}-${String(ingredient.id) || 'new'}`}
              >
                <div className="flex w-full items-start justify-between gap-2 md:flex-row flex-col">
                  <AppField name={`sections[${sectionIndex}].ingredients[${ingredientIndex}].id`}>
                    {({ ComboboxField }) => (
                      <ComboboxField
                        options={ingredientsOptions}
                        disabled={isSubmitting}
                        placeholder="Sélectionner un ingrédient"
                        searchPlaceholder="Rechercher un ingrédient"
                        addNew={(inputValue: string) => (
                          <AddIngredient key={inputValue} defaultValue={inputValue}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start font-normal px-1.5"
                            >
                              <PlusIcon className="size-4" aria-hidden="true" />
                              Nouvel ingrédient: {inputValue}
                            </Button>
                          </AddIngredient>
                        )}
                      />
                    )}
                  </AppField>
                  <AppField
                    name={`sections[${sectionIndex}].ingredients[${ingredientIndex}].quantity`}
                  >
                    {({ NumberField }) => (
                      <NumberField
                        min={0}
                        disabled={isSubmitting}
                        placeholder="Quantité"
                        decimalScale={3}
                      />
                    )}
                  </AppField>
                  <AppField
                    name={`sections[${sectionIndex}].ingredients[${ingredientIndex}].unitId`}
                  >
                    {({ ComboboxField }) => (
                      <ComboboxField
                        options={unitsOptions}
                        disabled={isSubmitting}
                        placeholder="Sélectionner une unité"
                        searchPlaceholder="Rechercher une unité"
                        noResultsLabel="Aucune unité trouvée"
                        addNew={(inputValue: string) => (
                          <AddUnit key={inputValue} defaultValue={inputValue}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start font-normal px-1.5"
                            >
                              <PlusIcon className="size-4" aria-hidden="true" />
                              Nouvelle unité: {inputValue}
                            </Button>
                          </AddUnit>
                        )}
                      />
                    )}
                  </AppField>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isSubmitting}
                    onClick={() => field.removeValue(ingredientIndex)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Separator className="md:hidden" />
              </Fragment>
            ))}
            <field.FieldError />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                field.pushValue({
                  id: '',
                  quantity: 0,
                })
              }}
              size="sm"
              disabled={isSubmitting}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </AppField>
    )
  },
})
