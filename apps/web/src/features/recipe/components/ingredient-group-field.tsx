import { type Option } from '@client/hooks/use-options'
import { Button } from '@recipe-organizer/design-system/button'
import { withForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { TrashIcon } from '@recipe-organizer/design-system/icons/trash'
import { Label } from '@recipe-organizer/design-system/label'
import { Separator } from '@recipe-organizer/design-system/separator'
import { unitOptions } from '@recipe-organizer/shared/units'
import { useSelector } from '@tanstack/react-store'
import { type ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'

import { recipeDefaultValues } from '../utils/form'

import * as styles from './ingredient-group-field.css'

interface IngredientFormProps {
  groupIndex: number
  addNewIngredientOption: (inputValue: string) => ReactNode
  ingredientOptions: Option<number>[]
}

const unitPickerItems = [{ label: 'Aucune', value: null }, ...unitOptions]

const ingredientFormProps: IngredientFormProps = { addNewIngredientOption: () => null, groupIndex: 0, ingredientOptions: [] }

export const IngredientGroupField = withForm({
  defaultValues: recipeDefaultValues,
  props: ingredientFormProps,
  render: ({ form, groupIndex, addNewIngredientOption, ingredientOptions }) => {
    const { AppField } = form
    const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

    return (
      <AppField mode="array" name={`ingredientGroups[${groupIndex}].ingredients`}>
        {(field) => (
          <div className={styles.container}>
            <Label>Ingrédients</Label>
            {field.state.value?.map((ingredient, ingredientIndex) => (
              <Fragment key={ingredient._key}>
                <div className={styles.container2}>
                  <div className={styles.container3}>
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
                    <TrashIcon size="sm" />
                  </Button>
                </div>
                <div className={styles.container4}>
                  <Separator />
                </div>
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
              <PlusIcon size="sm" />
            </Button>
          </div>
        )}
      </AppField>
    )
  },
})
