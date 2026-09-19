import { LinkedRecipesProvider } from '@client/features/recipe/contexts/linked-recipes-context'
import { useRecipeOptions } from '@client/features/recipe/hooks/use-recipe-options'
import { type Option } from '@client/hooks/use-options'
import { Button } from '@recipe-organizer/design-system/button'
import { withForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { type FileMetadata } from '@recipe-organizer/design-system/hooks/use-file-upload'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { TrashIcon } from '@recipe-organizer/design-system/icons/trash'
import { Label } from '@recipe-organizer/design-system/label'
import { Separator } from '@recipe-organizer/design-system/separator'
import { Skeleton } from '@recipe-organizer/design-system/skeleton'
import { ToolbarGroup, ToolbarSeparator } from '@recipe-organizer/design-system/toolbar'
import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '@recipe-organizer/shared/recipe/constants'
import { unitOptions } from '@recipe-organizer/shared/units'
import { useSelector } from '@tanstack/react-store'
import { Fragment, Suspense, type ReactNode } from 'react'

import { recipeDefaultValues, type recipeFormFields } from '../utils/form'
import { recipeNodes } from './editor/extensions'
import { MagimixProgramButton } from './editor/magimix/magimix-program-button'
import { SubrecipeButton } from './editor/subrecipe/subrecipe-button'

import * as ingredientGroupStyles from './ingredient-group-field.css'
import * as styles from './recipe-form.css'

const unitPickerItems = [{ label: 'Aucune', value: null }, ...unitOptions]

const cuisineTypeItems = CUISINE_TYPES.map((cuisineType) => ({
  label: CUISINE_TYPE_LABELS[cuisineType],
  value: cuisineType,
}))

const mealItems = MEALS.map((meal) => ({
  label: MEAL_LABELS[meal],
  value: meal,
}))

interface RecipeFormProps {
  initialImage?: FileMetadata
  initialVideo?: FileMetadata
  id?: number
  addNewIngredientOption: (inputValue: string) => ReactNode
  fields?: typeof recipeFormFields
  ingredientOptions: Option<number>[]
}

const recipeFormProps: RecipeFormProps = { addNewIngredientOption: () => null, ingredientOptions: [] }

export const RecipeForm = withForm({
  defaultValues: recipeDefaultValues,
  props: recipeFormProps,
  render: ({ form, initialImage, initialVideo, id, addNewIngredientOption, ingredientOptions }) => {
    const { AppField, Field } = form

    const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)
    const linkedRecipeIds = useSelector(form.store, (state) =>
      (state.values.linkedRecipes ?? []).map((lr) => lr.id).filter((recipeId) => recipeId > 0)
    )
    const recipeOptions = useRecipeOptions({ filter: (recipe) => recipe.id !== id })

    return (
      <>
        <AppField name="name">{({ TextField }) => <TextField disabled={isSubmitting} label="Nom de la recette" />}</AppField>

        <AppField name="servings">{({ NumberField }) => <NumberField disabled={isSubmitting} label="Portions" min={0} />}</AppField>

        <AppField name="meals">{({ ToggleGroupField }) => <ToggleGroupField disabled={isSubmitting} items={mealItems} label="Repas" />}</AppField>

        <AppField name="cuisineTypes">
          {({ ToggleGroupField }) => <ToggleGroupField disabled={isSubmitting} items={cuisineTypeItems} label="Cuisines" />}
        </AppField>

        <div className={styles.container}>
          <Label>Sous-recettes liées</Label>
          <AppField mode="array" name="linkedRecipes">
            {(field) => (
              <>
                {field.state.value?.map((linkedRecipe, index) => (
                  <div className={styles.linkedRecipeRow} key={linkedRecipe.id}>
                    <div className={styles.linkedRecipeFields}>
                      <AppField name={`linkedRecipes[${index}].id`}>
                        {({ ComboboxField }) => (
                          <div className={styles.linkedRecipeSelect}>
                            <ComboboxField
                              disabled={isSubmitting}
                              options={recipeOptions}
                              placeholder="Sélectionner une sous-recette"
                              searchPlaceholder="Rechercher une sous-recette"
                            />
                          </div>
                        )}
                      </AppField>
                      <AppField name={`linkedRecipes[${index}].ratio`}>
                        {({ NumberField }) => (
                          <div className={styles.linkedRecipeRatio}>
                            <NumberField disabled={isSubmitting} min={0} placeholder="Ratio" />
                          </div>
                        )}
                      </AppField>
                    </div>
                    <Button disabled={isSubmitting} onClick={() => field.removeValue(index)} size="icon" type="button" variant="destructive-outline">
                      <TrashIcon size="sm" />
                    </Button>
                  </div>
                ))}
                <Button disabled={isSubmitting} onClick={() => field.pushValue({ id: -1, ratio: 1 })} size="sm" type="button" variant="outline">
                  Ajouter une sous-recette <PlusIcon size="sm" />
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

        <div className={styles.ingredientGroupsSection}>
          <Label>Groupes d&apos;ingrédients</Label>
          <Field mode="array" name="ingredientGroups">
            {(field) => (
              <>
                {field.state.value?.map((group, groupIndex) => (
                  <AppField key={group._key} name={`ingredientGroups[${groupIndex}]`}>
                    {({ Field: GroupField, FieldError }) => (
                      <div className={styles.ingredientGroupCard}>
                        <GroupField>
                          {groupIndex !== 0 && (
                            <>
                              <AppField name={`ingredientGroups[${groupIndex}].groupName`}>
                                {({ TextField }) => (
                                  <div className={styles.groupNameField}>
                                    <TextField disabled={isSubmitting} label="Nom du groupe" />
                                  </div>
                                )}
                              </AppField>
                              <div className={styles.groupRemoveButton}>
                                <Button
                                  disabled={isSubmitting}
                                  onClick={() => field.removeValue(groupIndex)}
                                  size="icon"
                                  type="button"
                                  variant="destructive-outline"
                                >
                                  <TrashIcon size="sm" />
                                </Button>
                              </div>
                            </>
                          )}

                          <AppField mode="array" name={`ingredientGroups[${groupIndex}].ingredients`}>
                            {(ingredientField) => (
                              <div className={ingredientGroupStyles.container}>
                                <Label>Ingrédients</Label>
                                {ingredientField.state.value?.map((ingredient, ingredientIndex) => (
                                  <Fragment key={ingredient._key}>
                                    <div className={ingredientGroupStyles.ingredientRow}>
                                      <div className={ingredientGroupStyles.ingredientFields}>
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
                                        onClick={() => ingredientField.removeValue(ingredientIndex)}
                                        size="icon"
                                        type="button"
                                        variant="destructive-outline"
                                      >
                                        <TrashIcon size="sm" />
                                      </Button>
                                    </div>
                                    <div className={ingredientGroupStyles.mobileSeparator}>
                                      <Separator />
                                    </div>
                                  </Fragment>
                                ))}
                                <ingredientField.FieldError />
                                <Button
                                  disabled={isSubmitting}
                                  onClick={() => {
                                    ingredientField.pushValue({
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
                          <FieldError />
                        </GroupField>
                      </div>
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
                  Ajouter un groupe <PlusIcon size="sm" />
                </Button>
              </>
            )}
          </Field>
        </div>

        <LinkedRecipesProvider linkedRecipeIds={linkedRecipeIds}>
          <AppField name="instructions">
            {({ EditorField }) => (
              <Suspense fallback={<Skeleton preset="recipe-form" />}>
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
