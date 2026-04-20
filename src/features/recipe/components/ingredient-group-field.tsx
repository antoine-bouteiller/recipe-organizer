import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useStore } from '@tanstack/react-form'
import { Fragment } from 'react/jsx-runtime'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AddIngredient } from '@/features/ingredients/components/add-ingredient'
import { withForm } from '@/hooks/use-app-form'
import { useIngredientOptions } from '@/hooks/use-options'
import { unitOptions } from '@/lib/db/schema/unit'

import { recipeDefaultValues } from '../utils/form'

interface IngredientFormProps {
  groupIndex: number
}

const unitPickerItems = [{ label: 'Aucune', value: '' }, ...unitOptions]

export const IngredientGroupField = withForm({
  defaultValues: recipeDefaultValues,
  props: {} as IngredientFormProps,
  render: function Render({ form, groupIndex }) {
    const { AppField } = form
    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    const ingredientsOptions = useIngredientOptions()

    return (
      <AppField mode="array" name={`ingredientGroups[${groupIndex}].ingredients`}>
        {(field) => (
          <div className="flex w-full flex-col gap-2 pt-2">
            <Label>Ingrédients</Label>
            {field.state.value?.map((ingredient, ingredientIndex) => (
              <Fragment key={ingredient._key}>
                <div className="flex gap-2">
                  <div className="flex w-full flex-1 flex-col items-start justify-between gap-2 md:flex-row">
                    <AppField name={`ingredientGroups[${groupIndex}].ingredients[${ingredientIndex}].id`}>
                      {({ ComboboxField }) => (
                        <ComboboxField
                          addNew={(inputValue) => (
                            <AddIngredient defaultValue={inputValue} key={inputValue}>
                              <Button className="w-full justify-start px-1.5 font-normal" size="sm" variant="ghost">
                                <PlusIcon aria-hidden="true" className="size-4" />
                                Nouvel ingrédient: {inputValue}
                              </Button>
                            </AddIngredient>
                          )}
                          disabled={isSubmitting}
                          options={ingredientsOptions}
                          placeholder="Sélectionner un ingrédient"
                          searchPlaceholder="Rechercher un ingrédient"
                        />
                      )}
                    </AppField>
                    <AppField name={`ingredientGroups[${groupIndex}].ingredients[${ingredientIndex}].quantity`}>
                      {({ NumberField }) => <NumberField disabled={isSubmitting} min={0} placeholder="Quantité" allowDecimals />}
                    </AppField>
                    <AppField name={`ingredientGroups[${groupIndex}].ingredients[${ingredientIndex}].unitSlug`}>
                      {({ SelectField }) => <SelectField disabled={isSubmitting} items={unitPickerItems} />}
                    </AppField>
                  </div>
                  <Button
                    disabled={isSubmitting}
                    onClick={() => field.removeValue(ingredientIndex)}
                    size="icon"
                    type="button"
                    variant="destructive-outline"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Separator className="md:hidden" />
              </Fragment>
            ))}
            <field.FieldError />
            <Button
              disabled={isSubmitting}
              onClick={() => {
                field.pushValue({
                  _key: Math.random().toString(36).substring(7),
                  id: -1,
                  quantity: 0,
                })
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </AppField>
    )
  },
})
