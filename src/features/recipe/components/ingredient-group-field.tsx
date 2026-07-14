import { unitOptions } from '@schema'
import { useSelector } from '@tanstack/solid-store'
import { Plus, Trash } from 'phosphor-solid'
import { For, type JSX } from 'solid-js'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { withForm } from '@/hooks/use-app-form'
import { type Option } from '@/hooks/use-options'

import { recipeDefaultValues } from '../utils/form'

interface IngredientFormProps extends Record<string, unknown> {
  addNewIngredientOption: (inputValue: string) => JSX.Element
  groupIndex: number
  ingredientOptions: Option<number>[]
}

const unitPickerItems = [{ label: 'Aucune', value: null }, ...unitOptions]

export const IngredientGroupField = withForm({
  defaultValues: recipeDefaultValues,
  props: {} as IngredientFormProps,
  render: (props) => {
    const { form } = props
    const { AppField } = form
    const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

    return (
      <AppField mode="array" name={`ingredientGroups[${props.groupIndex}].ingredients`}>
        {(field) => (
          <div class="flex w-full flex-col gap-2 pt-2">
            <Label>Ingrédients</Label>
            <For each={field().state.value}>
              {(_ingredient, ingredientIndex) => (
                <>
                  <div class="flex gap-2">
                    <div class="flex w-full flex-1 flex-col items-start justify-between gap-2 md:flex-row">
                      <AppField name={`ingredientGroups[${props.groupIndex}].ingredients[${ingredientIndex()}].id`}>
                        {({ ComboboxField }) => (
                          <ComboboxField
                            addNew={props.addNewIngredientOption}
                            disabled={isSubmitting()}
                            options={props.ingredientOptions}
                            placeholder="Sélectionner un ingrédient"
                            searchPlaceholder="Rechercher un ingrédient"
                          />
                        )}
                      </AppField>
                      <AppField name={`ingredientGroups[${props.groupIndex}].ingredients[${ingredientIndex()}].quantity`}>
                        {({ NumberField }) => <NumberField disabled={isSubmitting()} min={0} placeholder="Quantité" />}
                      </AppField>
                      <AppField name={`ingredientGroups[${props.groupIndex}].ingredients[${ingredientIndex()}].unitSlug`}>
                        {({ SelectField }) => <SelectField disabled={isSubmitting()} items={unitPickerItems} />}
                      </AppField>
                    </div>
                    <Button
                      disabled={isSubmitting()}
                      onClick={() => field().removeValue(ingredientIndex())}
                      size="icon"
                      type="button"
                      variant="destructive-outline"
                    >
                      <Trash class="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator class="md:hidden" />
                </>
              )}
            </For>
            <field.FieldError />
            <Button
              disabled={isSubmitting()}
              onClick={() => {
                field().pushValue({
                  _key: Math.random().toString(36).substring(7),
                  id: -1,
                  quantity: 0,
                })
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              <Plus class="h-4 w-4" />
            </Button>
          </div>
        )}
      </AppField>
    )
  },
})
