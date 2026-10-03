import { Fragment } from 'react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/actions/button/button'
import { PlusIcon, TrashIcon } from '@/components/ui/data-display/icons'
import { ComboboxField } from '@/components/ui/forms/combobox-field/combobox-field'
import { Field, FieldError } from '@/components/ui/forms/field/field'
import { ImageField } from '@/components/ui/forms/image-field/image-field'
import { Label } from '@/components/ui/forms/label/label'
import { NumberField } from '@/components/ui/forms/number-field/number-field'
import { SelectField } from '@/components/ui/forms/select-field/select-field'
import { TextField } from '@/components/ui/forms/text-field/text-field'
import { ToggleGroupField } from '@/components/ui/forms/toggle-group-field/toggle-group-field'
import { VideoField } from '@/components/ui/forms/video-field/video-field'
import { Separator } from '@/components/ui/layout/separator/separator'
import { LinkedRecipesProvider } from '@/features/recipe/client/contexts/linked-recipes-context'
import { useRecipeOptions } from '@/features/recipe/client/hooks/use-recipe-options'
import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '@/features/recipe/constants'
import type { RecipeFormInput } from '@/features/recipe/schemas'
import type { FileMetadata } from '@/hooks/use-file-upload'
import type { Option } from '@/hooks/use-options'
import { replaceAt, removeAt } from '@/utils/array'
import { unitOptions } from '@/utils/units'

import { StepsField } from './steps/steps-field'

import * as ingredientGroupStyles from './ingredient-group-field.css'
import * as styles from './recipe-form.css'

const newKey = () => Math.random().toString(36).substring(7)
const unitPickerItems = [{ label: 'Aucune', value: null }, ...unitOptions]
const cuisineTypeItems = CUISINE_TYPES.map((value) => ({ label: CUISINE_TYPE_LABELS[value], value }))
const mealItems = MEALS.map((value) => ({ label: MEAL_LABELS[value], value }))

export interface RecipeFormState {
  data: RecipeFormInput
  setData: <TKey extends keyof RecipeFormInput>(key: TKey, value: RecipeFormInput[TKey]) => void
  pending: boolean
}

interface RecipeFormProps {
  form: RecipeFormState
  initialImage?: FileMetadata
  initialVideo?: FileMetadata
  id?: number
  addNewIngredientOption: (inputValue: string) => ReactNode
  ingredientOptions: Option<number>[]
}

export const RecipeForm = ({ form, initialImage, initialVideo, id, addNewIngredientOption, ingredientOptions }: RecipeFormProps) => {
  const { data, setData, pending } = form
  const linkedRecipes = data.linkedRecipes ?? []
  const groups = data.ingredientGroups ?? []
  const linkedRecipeIds = linkedRecipes.map((recipe) => recipe.id).filter((recipeId) => recipeId > 0)
  const recipeOptions = useRecipeOptions({ filter: (recipe) => recipe.id !== id })

  return (
    <>
      <TextField name="name" value={data.name ?? ''} onChange={(value) => setData('name', value)} disabled={pending} label="Nom de la recette" />
      <NumberField
        name="servings"
        value={data.servings}
        onChange={(value) => setData('servings', value)}
        disabled={pending}
        label="Portions"
        min={0}
      />
      <ToggleGroupField
        name="meals"
        value={data.meals ?? []}
        onChange={(value) => setData('meals', value)}
        disabled={pending}
        items={mealItems}
        label="Repas"
      />
      <ToggleGroupField
        name="cuisineTypes"
        value={data.cuisineTypes ?? []}
        onChange={(value) => setData('cuisineTypes', value)}
        disabled={pending}
        items={cuisineTypeItems}
        label="Cuisines"
      />
      <div className={styles.container}>
        <Label>Sous-recettes liées</Label>
        <Field name="linkedRecipes">
          {linkedRecipes.map((linkedRecipe, index) => (
            <div className={styles.linkedRecipeRow} key={linkedRecipe._key ?? linkedRecipe.id}>
              <div className={styles.linkedRecipeFields}>
                <div className={styles.linkedRecipeSelect}>
                  <ComboboxField
                    name={`linkedRecipes.${index}.id`}
                    value={linkedRecipe.id}
                    onChange={(value) => setData('linkedRecipes', replaceAt(linkedRecipes, index, { ...linkedRecipe, id: value ?? -1 }))}
                    disabled={pending}
                    options={recipeOptions}
                    placeholder="Sélectionner une sous-recette"
                    searchPlaceholder="Rechercher une sous-recette"
                  />
                </div>
                <div className={styles.linkedRecipeRatio}>
                  <NumberField
                    name={`linkedRecipes.${index}.ratio`}
                    value={Number.isNaN(linkedRecipe.ratio) ? undefined : linkedRecipe.ratio}
                    onChange={(value) => setData('linkedRecipes', replaceAt(linkedRecipes, index, { ...linkedRecipe, ratio: value ?? Number.NaN }))}
                    disabled={pending}
                    min={0}
                    placeholder="Ratio"
                  />
                </div>
              </div>
              <Button
                disabled={pending}
                onClick={() => setData('linkedRecipes', removeAt(linkedRecipes, index))}
                size="icon"
                type="button"
                variant="destructive-outline"
              >
                <TrashIcon size="sm" />
              </Button>
            </div>
          ))}
          <FieldError />
          <Button
            disabled={pending}
            onClick={() => setData('linkedRecipes', [...linkedRecipes, { _key: newKey(), id: -1, ratio: 1 }])}
            size="sm"
            type="button"
            variant="outline"
          >
            Ajouter une sous-recette <PlusIcon size="sm" />
          </Button>
        </Field>
      </div>
      <ImageField
        name="image"
        value={data.image}
        onChange={(value) => setData('image', value)}
        disabled={pending}
        initialImage={initialImage}
        label="Photo de la recette"
      />
      <VideoField
        name="video"
        value={data.video}
        onChange={(value) => setData('video', value)}
        disabled={pending}
        initialVideo={initialVideo}
        label="Vidéo (optionnel)"
      />
      <div className={styles.ingredientGroupsSection}>
        <Label>Groupes d&apos;ingrédients</Label>
        <Field name="ingredientGroups">
          {groups.map((group, groupIndex) => {
            const updateGroup = (value: typeof group) => setData('ingredientGroups', replaceAt(groups, groupIndex, value))
            return (
              <div className={styles.ingredientGroupCard} key={group._key}>
                <Field name={`ingredientGroups.${groupIndex}`}>
                  {groupIndex !== 0 && (
                    <>
                      <div className={styles.groupNameField}>
                        <TextField
                          name={`ingredientGroups.${groupIndex}.groupName`}
                          value={group.groupName ?? ''}
                          onChange={(value) => updateGroup({ ...group, groupName: value })}
                          disabled={pending}
                          label="Nom du groupe"
                        />
                      </div>
                      <div className={styles.groupRemoveButton}>
                        <Button
                          disabled={pending}
                          onClick={() => setData('ingredientGroups', removeAt(groups, groupIndex))}
                          size="icon"
                          type="button"
                          variant="destructive-outline"
                        >
                          <TrashIcon size="sm" />
                        </Button>
                      </div>
                    </>
                  )}
                  <Field name={`ingredientGroups.${groupIndex}.ingredients`}>
                    <div className={ingredientGroupStyles.container}>
                      <Label>Ingrédients</Label>
                      {group.ingredients.map((ingredient, ingredientIndex) => {
                        const path = `ingredientGroups.${groupIndex}.ingredients.${ingredientIndex}`
                        const updateIngredient = (value: typeof ingredient) =>
                          updateGroup({ ...group, ingredients: replaceAt(group.ingredients, ingredientIndex, value) })
                        return (
                          <Fragment key={ingredient._key}>
                            <div className={ingredientGroupStyles.ingredientRow}>
                              <div className={ingredientGroupStyles.ingredientFields}>
                                <ComboboxField
                                  name={`${path}.id`}
                                  value={ingredient.id}
                                  onChange={(value) => updateIngredient({ ...ingredient, id: value ?? -1 })}
                                  addNew={addNewIngredientOption}
                                  disabled={pending}
                                  options={ingredientOptions}
                                  placeholder="Sélectionner un ingrédient"
                                  searchPlaceholder="Rechercher un ingrédient"
                                />
                                <NumberField
                                  name={`${path}.quantity`}
                                  value={Number.isNaN(ingredient.quantity) ? undefined : ingredient.quantity}
                                  onChange={(value) => updateIngredient({ ...ingredient, quantity: value ?? Number.NaN })}
                                  disabled={pending}
                                  min={0}
                                  placeholder="Quantité"
                                />
                                <SelectField
                                  name={`${path}.unitSlug`}
                                  value={ingredient.unitSlug}
                                  onChange={(value) =>
                                    updateIngredient({ ...ingredient, unitSlug: unitOptions.find((option) => option.value === value)?.value })
                                  }
                                  disabled={pending}
                                  items={unitPickerItems}
                                />
                              </div>
                              <Button
                                disabled={pending}
                                onClick={() => updateGroup({ ...group, ingredients: removeAt(group.ingredients, ingredientIndex) })}
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
                        )
                      })}
                      <FieldError />
                      <Button
                        disabled={pending}
                        onClick={() => updateGroup({ ...group, ingredients: [...group.ingredients, { _key: newKey(), id: -1, quantity: 0 }] })}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        <PlusIcon size="sm" />
                      </Button>
                    </div>
                  </Field>
                  <FieldError />
                </Field>
              </div>
            )
          })}
          <FieldError />
          <Button
            disabled={pending}
            onClick={() => setData('ingredientGroups', [...groups, { _key: newKey(), ingredients: [] }])}
            size="sm"
            type="button"
            variant="outline"
          >
            Ajouter un groupe <PlusIcon size="sm" />
          </Button>
        </Field>
      </div>
      <LinkedRecipesProvider linkedRecipeIds={linkedRecipeIds}>
        <StepsField disabled={pending} form={form} />
      </LinkedRecipesProvider>
    </>
  )
}
