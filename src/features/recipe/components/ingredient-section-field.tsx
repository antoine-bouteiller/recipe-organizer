import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AddIngredient } from '@/features/ingredients/components/add-ingredient'
import { AddUnit } from '@/features/units/components/add-unit'
import { withForm } from '@/hooks/use-app-form'
import { useIngredientOptions, useUnitOptions } from '@/hooks/use-options'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useStore } from '@tanstack/react-form'
import { Fragment } from 'react/jsx-runtime'
import { recipeDefaultValues } from '../utils/constants'

interface IngredientFormProps {
  sectionIndex: number
}

export const IngredientSectionField = withForm({
  defaultValues: recipeDefaultValues,
  props: {} as IngredientFormProps,
  render: function Render({ form, sectionIndex }) {
    const { AppField } = form
    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    const ingredientsOptions = useIngredientOptions()
    const unitsOptions = useUnitOptions({ allowEmpty: true })

    return (
      <AppField name={`sections[${sectionIndex}].ingredients`} mode="array">
        {(field) => (
          <div className="flex flex-col gap-2 pt-2 w-full">
            <Label>Ingrédients</Label>
            {field.state.value?.map((ingredient, ingredientIndex) => (
              <Fragment
                key={`ingredient-s${sectionIndex}-i${ingredientIndex}-${String(ingredient.id) || 'new'}`}
              >
                <div className="flex gap-2">
                  <div className="flex w-full items-start justify-between gap-2 md:flex-row flex-col flex-1">
                    <AppField name={`sections[${sectionIndex}].ingredients[${ingredientIndex}].id`}>
                      {({ ComboboxField }) => (
                        <ComboboxField
                          options={ingredientsOptions}
                          disabled={isSubmitting}
                          placeholder="Sélectionner un ingrédient"
                          searchPlaceholder="Rechercher un ingrédient"
                          addNew={(inputValue) => (
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
                  </div>
                  <Button
                    type="button"
                    variant="destructive-outline"
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
                  id: undefined,
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
