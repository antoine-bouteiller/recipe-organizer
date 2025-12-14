import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useStore } from '@tanstack/react-form'

import type { FileMetadata } from '@/hooks/use-file-upload'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { type RecipeFormInput } from '@/features/recipe/api/create'
import { withForm } from '@/hooks/use-app-form'

import { recipeDefaultValues } from '../utils/constants'
import { IngredientGroupField } from './ingredient-group-field'

const generateGroupKey = (group: NonNullable<RecipeFormInput['ingredientGroups']>[number], index: number): string => {
  const firstIngredientId = JSON.stringify(group.ingredients?.[0]?.id ?? '')
  return `group-${index}-${firstIngredientId}`
}

interface RecipeFormProps extends Record<string, unknown> {
  initialImage?: FileMetadata
}

export const RecipeForm = withForm({
  defaultValues: recipeDefaultValues,
  props: {} as RecipeFormProps,
  render: function Render({ form, initialImage }) {
    const { AppField, Field } = form

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    return (
      <>
        <AppField name="name">{({ TextField }) => <TextField disabled={isSubmitting} label="Nom de la recette" />}</AppField>

        <AppField name="servings">{({ NumberField }) => <NumberField disabled={isSubmitting} label="Portions" min={0} />}</AppField>

        <AppField name="isSubrecipe">{({ CheckboxField }) => <CheckboxField disabled={isSubmitting} label="Sous-recette" />}</AppField>

        <AppField name="image">
          {({ ImageField }) => <ImageField disabled={isSubmitting} initialImage={initialImage} label="Photo de la recette" />}
        </AppField>

        <div className="flex flex-col gap-2 pt-2">
          <Label>Groupes d&apos;ingrédients</Label>
          <Field mode="array" name="ingredientGroups">
            {(field) => (
              <>
                {field.state.value?.map((group, groupIndex) => (
                  <AppField key={generateGroupKey(group, groupIndex)} name={`ingredientGroups[${groupIndex}]`}>
                    {({ Field, FieldError }) => (
                      <Field className="relative rounded-xl border p-4">
                        {groupIndex !== 0 && (
                          <>
                            <AppField name={`ingredientGroups[${groupIndex}].groupName`}>
                              {({ TextField }) => <TextField className="pt-2" disabled={isSubmitting} label="Nom du groupe" />}
                            </AppField>
                            <Button
                              className="absolute top-2 right-2"
                              disabled={isSubmitting}
                              onClick={() => field.removeValue(groupIndex)}
                              size="icon"
                              type="button"
                              variant="destructive-outline"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        <IngredientGroupField form={form} groupIndex={groupIndex} />
                        <FieldError />
                      </Field>
                    )}
                  </AppField>
                ))}
                <Button
                  disabled={isSubmitting}
                  onClick={() => {
                    field.pushValue({
                      groupName: undefined,
                      ingredients: [],
                    })
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Ajouter un groupe <PlusIcon className="h-4 w-4" />
                </Button>
              </>
            )}
          </Field>
        </div>

        <AppField name="instructions">{({ TiptapField }) => <TiptapField disabled={isSubmitting} label="Instructions" />}</AppField>
      </>
    )
  },
})
