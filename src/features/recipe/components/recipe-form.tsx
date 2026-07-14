import { useSelector } from '@tanstack/solid-store'
import { Plus, Trash } from 'phosphor-solid'
import { For, type JSX, Show, Suspense } from 'solid-js'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { LinkedRecipesProvider } from '@/features/recipe/contexts/linked-recipes-context'
import { useRecipeOptions } from '@/features/recipe/hooks/use-recipe-options'
import { withForm } from '@/hooks/use-app-form'
import { type FileMetadata } from '@/hooks/use-file-upload'
import { type Option } from '@/hooks/use-options'

import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '../utils/constants'
import { recipeDefaultValues } from '../utils/form'
import { IngredientGroupField } from './ingredient-group-field'

const cuisineTypeItems = CUISINE_TYPES.map((cuisineType) => ({
  label: CUISINE_TYPE_LABELS[cuisineType],
  value: cuisineType,
}))

const mealItems = MEALS.map((meal) => ({
  label: MEAL_LABELS[meal],
  value: meal,
}))

interface RecipeFormProps extends Record<string, unknown> {
  addNewIngredientOption: (inputValue: string) => JSX.Element
  id?: number
  ingredientOptions: Option<number>[]
  initialImage?: FileMetadata
  initialVideo?: FileMetadata
}

export const RecipeForm = withForm({
  defaultValues: recipeDefaultValues,
  props: {} as RecipeFormProps,
  render: (props) => {
    const { form } = props
    const { AppField, Field } = form

    const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)
    const linkedRecipeIds = useSelector(form.store, (state) =>
      (state.values.linkedRecipes ?? []).map((lr: { id: number }) => lr.id).filter((recipeId) => recipeId > 0)
    )
    const recipeOptions = useRecipeOptions({ filter: (recipe) => recipe.id !== props.id })

    return (
      <>
        <AppField name="name">{({ TextField }) => <TextField disabled={isSubmitting()} label="Nom de la recette" />}</AppField>

        <AppField name="servings">{({ NumberField }) => <NumberField disabled={isSubmitting()} label="Portions" min={0} />}</AppField>

        <AppField name="meals">{({ ToggleGroupField }) => <ToggleGroupField disabled={isSubmitting()} items={mealItems} label="Repas" />}</AppField>

        <AppField name="cuisineTypes">
          {({ ToggleGroupField }) => <ToggleGroupField disabled={isSubmitting()} items={cuisineTypeItems} label="Cuisines" />}
        </AppField>

        <div class="flex flex-col gap-2">
          <Label>Sous-recettes liées</Label>
          <AppField mode="array" name="linkedRecipes">
            {(field) => (
              <>
                <For each={field().state.value}>
                  {(_linkedRecipe, index) => (
                    <div class="flex gap-2">
                      <div class="flex flex-1 gap-2 overflow-hidden">
                        <AppField name={`linkedRecipes[${index()}].id`}>
                          {({ ComboboxField }) => (
                            <ComboboxField
                              class="flex-1 overflow-hidden"
                              disabled={isSubmitting()}
                              options={recipeOptions}
                              placeholder="Sélectionner une sous-recette"
                              searchPlaceholder="Rechercher une sous-recette"
                            />
                          )}
                        </AppField>
                        <AppField name={`linkedRecipes[${index()}].ratio`}>
                          {({ NumberField }) => <NumberField class="w-28 shrink-0" disabled={isSubmitting()} min={0} placeholder="Ratio" />}
                        </AppField>
                      </div>
                      <Button
                        disabled={isSubmitting()}
                        onClick={() => field().removeValue(index())}
                        size="icon"
                        type="button"
                        variant="destructive-outline"
                      >
                        <Trash class="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </For>
                <Button disabled={isSubmitting()} onClick={() => field().pushValue({ id: -1, ratio: 1 })} size="sm" type="button" variant="outline">
                  Ajouter une sous-recette <Plus class="h-4 w-4" />
                </Button>
              </>
            )}
          </AppField>
        </div>

        <AppField name="image">
          {({ ImageField }) => <ImageField disabled={isSubmitting()} initialImage={props.initialImage} label="Photo de la recette" />}
        </AppField>

        <AppField name="video">
          {({ VideoField }) => <VideoField disabled={isSubmitting()} initialVideo={props.initialVideo} label="Vidéo (optionnel)" />}
        </AppField>

        <div class="flex flex-col gap-2 pt-2">
          <Label>Groupes d&apos;ingrédients</Label>
          <Field mode="array" name="ingredientGroups">
            {(field) => (
              <>
                <For each={field().state.value}>
                  {(_group, groupIndex) => (
                    <AppField name={`ingredientGroups[${groupIndex()}]`}>
                      {({ Field: GroupField, FieldError }) => (
                        <GroupField class="relative rounded-xl border p-4">
                          <Show when={groupIndex() !== 0}>
                            <AppField name={`ingredientGroups[${groupIndex()}].groupName`}>
                              {({ TextField }) => <TextField class="pt-2" disabled={isSubmitting()} label="Nom du groupe" />}
                            </AppField>
                            <Button
                              class="absolute top-2 right-2"
                              disabled={isSubmitting()}
                              onClick={() => field().removeValue(groupIndex())}
                              size="icon"
                              type="button"
                              variant="destructive-outline"
                            >
                              <Trash class="h-4 w-4" />
                            </Button>
                          </Show>

                          <IngredientGroupField
                            addNewIngredientOption={props.addNewIngredientOption}
                            form={form}
                            groupIndex={groupIndex()}
                            ingredientOptions={props.ingredientOptions}
                          />
                          <FieldError />
                        </GroupField>
                      )}
                    </AppField>
                  )}
                </For>
                <Button
                  disabled={isSubmitting()}
                  onClick={() => {
                    field().pushValue({
                      _key: Math.random().toString(36).substring(7),
                      groupName: undefined,
                      ingredients: [],
                    })
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Ajouter un groupe <Plus class="h-4 w-4" />
                </Button>
              </>
            )}
          </Field>
        </div>

        <LinkedRecipesProvider linkedRecipeIds={linkedRecipeIds()}>
          <AppField name="instructions">
            {({ EditorField }) => (
              <Suspense fallback={<Skeleton class="h-64 w-full" />}>
                <EditorField disabled={isSubmitting()} label="Instructions" />
              </Suspense>
            )}
          </AppField>
        </LinkedRecipesProvider>
      </>
    )
  },
})
