import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { unitOptions } from '@schema'
import { useSelector } from '@tanstack/solid-store'
import { type ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { withForm } from '@/hooks/use-app-form'
import { type Option } from '@/hooks/use-options'

import { recipeDefaultValues } from '../utils/form'

interface IngredientFormProps {
  groupIndex: number
  addNewIngredientOption: (inputValue: string) => ReactNode
  ingredientOptions: Option<number>[]
}

const unitPickerItems = [{ label: 'Aucune', value: null }, ...unitOptions]

export const IngredientGroupField = withForm({
  defaultValues: recipeDefaultValues,
  props: {} as IngredientFormProps,
  render: ({ form, groupIndex, addNewIngredientOption, ingredientOptions }) => {
    const { AppField } = form
    const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

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
                          addNew={addNewIngredientOption}
                          disabled={isSubmitting}
                          options={ingredientOptions}
                          placeholder="Sélectionner un ingrédient"
                          searchPlaceholder="Rechercher un ingrédient"
                        />
                      )}
                    </AppField>
                    <AppField name={`ingredientGroups[${groupIndex}].ingredients[${ingredientIndex}].quantity`}>
                      {({ NumberField }) => <NumberField disabled={isSubmitting} min={0} placeholder="Quantité" />}
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
