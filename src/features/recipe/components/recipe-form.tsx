import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useStore } from '@tanstack/react-form'

import type { FileMetadata } from '@/hooks/use-file-upload'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { type RecipeFormInput } from '@/features/recipe/api/create'
import AddExistingRecipe from '@/features/recipe/components/add-existing-recipe'
import { withForm } from '@/hooks/use-app-form'

import { recipeDefaultValues } from '../utils/constants'
import { IngredientSectionField } from './ingredient-section-field'

const hasSubRecipe = (section: NonNullable<RecipeFormInput['sections']>[number] | undefined) => section && 'recipeId' in section && !!section.recipeId

const generateSectionKey = (section: NonNullable<RecipeFormInput['sections']>[number], index: number): string => {
  if (section && 'recipeId' in section) {
    return `section-recipe-${JSON.stringify(section.recipeId)}`
  }
  const firstIngredientId = JSON.stringify(section.ingredients?.[0]?.id ?? '')
  return `section-${index}-${firstIngredientId}`
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

        <AppField name="quantity">{({ NumberField }) => <NumberField disabled={isSubmitting} label="Quantité" min={0} />}</AppField>

        <AppField name="image">
          {({ ImageField }) => <ImageField disabled={isSubmitting} initialImage={initialImage} label="Photo de la recette" />}
        </AppField>

        <div className="flex flex-col gap-2 pt-2">
          <Label>Groupes d&apos;ingrédients</Label>
          <Field mode="array" name="sections">
            {(field) => (
              <>
                {field.state.value?.map((section, sectionIndex) => (
                  <AppField key={generateSectionKey(section, sectionIndex)} name={`sections[${sectionIndex}]`}>
                    {({ Field, FieldError }) => (
                      <Field className="relative rounded-xl border p-4">
                        {sectionIndex !== 0 && (
                          <>
                            <AppField name={`sections[${sectionIndex}].name`}>
                              {({ TextField }) => <TextField className="pt-2" disabled={isSubmitting} label="Nom" />}
                            </AppField>
                            <Button
                              className="absolute top-2 right-2"
                              disabled={isSubmitting}
                              onClick={() => field.removeValue(sectionIndex)}
                              size="icon"
                              type="button"
                              variant="destructive-outline"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {hasSubRecipe(section) ? <div /> : <IngredientSectionField form={form} sectionIndex={sectionIndex} />}
                        <FieldError />
                      </Field>
                    )}
                  </AppField>
                ))}
                <div
                  className={`
                    flex w-full flex-col gap-2
                    md:flex-row
                  `}
                >
                  <Button
                    className="md:flex-1"
                    disabled={isSubmitting}
                    onClick={() => {
                      field.pushValue({
                        ingredients: [],
                        name: undefined,
                        ratio: 1,
                      })
                    }}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    Ajouter une section <PlusIcon className="h-4 w-4" />
                  </Button>
                  <AddExistingRecipe
                    disabled={isSubmitting}
                    onSelect={(selectedRecipe) => {
                      field.pushValue({
                        ingredients: [],
                        name: selectedRecipe.name,
                        ratio: 1,
                        recipeId: selectedRecipe.recipeId.toString(),
                      })
                    }}
                  />
                </div>
              </>
            )}
          </Field>
        </div>

        <AppField name="steps">{({ TiptapField }) => <TiptapField disabled={isSubmitting} label="Étapes" />}</AppField>
      </>
    )
  },
})
