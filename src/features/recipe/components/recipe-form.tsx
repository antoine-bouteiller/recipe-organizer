import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { type RecipeFormInput } from '@/features/recipe/api/create'
import AddExistingRecipe from '@/features/recipe/components/add-existing-recipe'
import { withForm } from '@/hooks/use-app-form'
import type { FileMetadata } from '@/hooks/use-file-upload'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useStore } from '@tanstack/react-form'
import { recipeDefaultValues } from '../utils/constants'
import { IngredientSectionField } from './ingredient-section-field'

const hasSubRecipe = (section: NonNullable<RecipeFormInput['sections']>[number] | undefined) =>
  section && 'recipeId' in section && !!section.recipeId

const generateSectionKey = (
  section: NonNullable<RecipeFormInput['sections']>[number],
  index: number
): string => {
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
        <AppField name="name">
          {({ TextField }) => <TextField label="Nom de la recette" disabled={isSubmitting} />}
        </AppField>

        <AppField name="quantity">
          {({ NumberField }) => <NumberField min={0} disabled={isSubmitting} label="Quantité" />}
        </AppField>

        <AppField name="image">
          {({ ImageField }) => (
            <ImageField
              label="Photo de la recette"
              disabled={isSubmitting}
              initialImage={initialImage}
            />
          )}
        </AppField>

        <div className="flex flex-col gap-2 pt-2">
          <Label>Groupes d&apos;ingrédients</Label>
          <Field name="sections" mode="array">
            {(field) => (
              <>
                {field.state.value?.map((section, sectionIndex) => (
                  <AppField
                    name={`sections[${sectionIndex}]`}
                    key={generateSectionKey(section, sectionIndex)}
                  >
                    {({ Field, FieldError }) => (
                      <Field className="p-4 border rounded-xl relative">
                        {sectionIndex !== 0 && (
                          <>
                            <AppField name={`sections[${sectionIndex}].name`}>
                              {({ TextField }) => (
                                <TextField label="Nom" disabled={isSubmitting} className="pt-2" />
                              )}
                            </AppField>
                            <Button
                              type="button"
                              variant="destructive-outline"
                              size="icon"
                              className="absolute top-2 right-2"
                              disabled={isSubmitting}
                              onClick={() => field.removeValue(sectionIndex)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {hasSubRecipe(section) ? (
                          <div />
                        ) : (
                          <IngredientSectionField form={form} sectionIndex={sectionIndex} />
                        )}
                        <FieldError />
                      </Field>
                    )}
                  </AppField>
                ))}
                <div className="flex w-full gap-2 md:flex-row flex-col">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      field.pushValue({
                        name: undefined,
                        ratio: 1,
                        ingredients: [],
                      })
                    }}
                    size="sm"
                    className="md:flex-1"
                    disabled={isSubmitting}
                  >
                    Ajouter une section <PlusIcon className="h-4 w-4" />
                  </Button>
                  <AddExistingRecipe
                    onSelect={(selectedRecipe) => {
                      field.pushValue({
                        recipeId: selectedRecipe.recipeId.toString(),
                        name: selectedRecipe.name,
                        ratio: 1,
                        ingredients: [],
                      })
                    }}
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}
          </Field>
        </div>

        <AppField name="steps">
          {({ TiptapField }) => <TiptapField label="Étapes" disabled={isSubmitting} />}
        </AppField>
      </>
    )
  },
})
