import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useStore } from '@tanstack/react-form'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { ToolbarGroup, ToolbarSeparator } from '@/components/ui/toolbar'
import { LinkedRecipesProvider } from '@/features/recipe/contexts/linked-recipes-context'
import { withForm } from '@/hooks/use-app-form'
import { type FileMetadata } from '@/hooks/use-file-upload'
import { useRecipeOptions } from '@/hooks/use-options'

import { RECIPE_TAG_LABELS, RECIPE_TAGS } from '../utils/constants'
import { recipeDefaultValues } from '../utils/form'
import { recipeNodes } from './editor/extensions'
import { MagimixProgramButton } from './editor/magimix/magimix-program-button'
import { SubrecipeButton } from './editor/subrecipe/subrecipe-button'
import { IngredientGroupField } from './ingredient-group-field'

const tagItems = RECIPE_TAGS.map((tag) => ({
  label: RECIPE_TAG_LABELS[tag],
  value: tag,
}))

interface RecipeFormProps extends Record<string, unknown> {
  initialImage?: FileMetadata
  initialVideo?: FileMetadata
  id?: number
}

export const RecipeForm = withForm({
  defaultValues: recipeDefaultValues,
  props: {} as RecipeFormProps,
  render: function Render({ form, initialImage, initialVideo, id }) {
    const { AppField, Field } = form

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
    const linkedRecipeIds = useStore(form.store, (state) => (state.values.linkedRecipes ?? []).map((lr) => lr.id).filter((recipeId) => recipeId > 0))
    const recipeOptions = useRecipeOptions({ filter: (recipe) => recipe.id !== id })

    return (
      <>
        <AppField name="name">{({ TextField }) => <TextField disabled={isSubmitting} label="Nom de la recette" />}</AppField>

        <AppField name="servings">{({ NumberField }) => <NumberField disabled={isSubmitting} label="Portions" min={0} />}</AppField>

        <AppField name="tags">{({ ToggleGroupField }) => <ToggleGroupField disabled={isSubmitting} items={tagItems} label="Tags" />}</AppField>

        <div className="flex flex-col gap-2">
          <Label>Sous-recettes liées</Label>
          <AppField mode="array" name="linkedRecipes">
            {(field) => (
              <>
                {field.state.value?.map((linkedRecipe, index) => (
                  <div className="flex gap-2" key={linkedRecipe.id}>
                    <div className="flex flex-1 gap-2 overflow-hidden">
                      <AppField name={`linkedRecipes[${index}].id`}>
                        {({ ComboboxField }) => (
                          <ComboboxField
                            disabled={isSubmitting}
                            options={recipeOptions}
                            placeholder="Sélectionner une sous-recette"
                            searchPlaceholder="Rechercher une sous-recette"
                            className="flex-1 overflow-hidden"
                          />
                        )}
                      </AppField>
                      <AppField name={`linkedRecipes[${index}].ratio`}>
                        {({ NumberField }) => <NumberField disabled={isSubmitting} min={0} placeholder="Ratio" className="w-28 shrink-0" />}
                      </AppField>
                    </div>
                    <Button disabled={isSubmitting} onClick={() => field.removeValue(index)} size="icon" type="button" variant="destructive-outline">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button disabled={isSubmitting} onClick={() => field.pushValue({ id: -1, ratio: 1 })} size="sm" type="button" variant="outline">
                  Ajouter une sous-recette <PlusIcon className="h-4 w-4" />
                </Button>
              </>
            )}
          </AppField>
        </div>

        <AppField name="image">
          {({ ImageField }) => <ImageField disabled={isSubmitting} initialImage={initialImage} label="Photo de la recette" />}
        </AppField>

        <AppField name="video">
          {({ VideoField }) => <VideoField disabled={isSubmitting} initialVideo={initialVideo} label="Vidéo (optionnel)" />}
        </AppField>

        <div className="flex flex-col gap-2 pt-2">
          <Label>Groupes d&apos;ingrédients</Label>
          <Field mode="array" name="ingredientGroups">
            {(field) => (
              <>
                {field.state.value?.map((group, groupIndex) => (
                  <AppField key={group._key} name={`ingredientGroups[${groupIndex}]`}>
                    {({ Field: GroupField, FieldError }) => (
                      <GroupField className="relative rounded-xl border p-4">
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
                      </GroupField>
                    )}
                  </AppField>
                ))}
                <Button
                  disabled={isSubmitting}
                  onClick={() => {
                    field.pushValue({
                      _key: Math.random().toString(36).substring(7),
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

        <LinkedRecipesProvider linkedRecipeIds={linkedRecipeIds}>
          <AppField name="instructions">
            {({ EditorField }) => (
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <EditorField
                  disabled={isSubmitting}
                  nodes={recipeNodes}
                  extraToolbar={
                    <>
                      <ToolbarSeparator />
                      <ToolbarGroup>
                        <MagimixProgramButton />
                        <SubrecipeButton />
                      </ToolbarGroup>
                    </>
                  }
                  label="Instructions"
                />
              </Suspense>
            )}
          </AppField>
        </LinkedRecipesProvider>
      </>
    )
  },
})
