import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AddIngredient } from '@/features/ingredients/add-ingredient'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import AddExistingRecipe from '@/features/recipe/add-existing-recipe'
import { type RecipeFormInput } from '@/features/recipe/api/create'
import { AddUnit } from '@/features/units/add-unit'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { withFieldGroup } from '@/hooks/use-app-form'
import type { FileMetadata } from '@/hooks/use-file-upload'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { createFieldMap, useStore } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'

export const recipeDefaultValues: RecipeFormInput = {
  name: '',
  steps: '',
  image: undefined,
  quantity: 4,
  sections: [
    {
      ingredients: [
        {
          id: '',
          quantity: 0,
        },
      ],
    },
  ],
}

const hasSubRecipe = (section: NonNullable<RecipeFormInput['sections']>[number] | undefined) =>
  section && 'recipeId' in section && !!section.recipeId

export const recipeFormFields = createFieldMap(recipeDefaultValues)

interface RecipeFormProps extends Record<string, unknown> {
  initialImage?: FileMetadata
}

export const RecipeForm = withFieldGroup({
  defaultValues: recipeDefaultValues,
  props: {} as RecipeFormProps,
  render: function Render({ group, initialImage }) {
    const { data: ingredients } = useQuery(getIngredientListOptions())
    const { data: units } = useQuery(getUnitsListOptions())

    const [ingredientKey, setIngredientKey] = useState(0)
    const [unitKey, setUnitKey] = useState(0)

    const ingredientsOptions = useMemo(
      () =>
        ingredients?.map((ingredient) => ({
          label: ingredient.name,
          value: ingredient.id.toString(),
        })) ?? [],
      [ingredients]
    )

    const unitsOptions = useMemo(
      () =>
        units?.map((unit) => ({
          label: unit.symbol,
          value: unit.id.toString(),
        })) ?? [],
      [units]
    )

    const { AppField, Field } = group

    const isSubmitting = useStore(group.form.store, (state) => state.isSubmitting)

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
          <div className="text-base font-semibold">Ingrédients</div>
          <Field name="sections" mode="array">
            {({ state: sectionsState, removeValue: removeSection, pushValue: addSection }) => (
              <>
                {sectionsState.value?.map((_, sectionIndex) => (
                  <AppField name={`sections[${sectionIndex}]`} key={`section-${sectionIndex}`}>
                    {({
                      FormItem: SectionFormItem,
                      FormControl: SectionFormControl,
                      FormMessage: SectionFormMessage,
                      state: sectionState,
                    }) => (
                      <SectionFormItem>
                        <SectionFormControl>
                          <div className="p-4 border rounded-xl relative">
                            {sectionIndex !== 0 && (
                              <>
                                <AppField name={`sections[${sectionIndex}].name`}>
                                  {({ TextField }) => (
                                    <TextField label="Nom" disabled={isSubmitting} />
                                  )}
                                </AppField>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  disabled={isSubmitting}
                                  onClick={() => removeSection(sectionIndex)}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </>
                            )}

                            {hasSubRecipe(sectionState.value) ? (
                              <div />
                            ) : (
                              <AppField name={`sections[${sectionIndex}].ingredients`} mode="array">
                                {({
                                  FormMessage: IngredientFormMessage,
                                  state: ingredientsState,
                                  removeValue: removeIngredient,
                                  pushValue: addIngredient,
                                }) => (
                                  <div className="flex flex-col gap-2 pt-2">
                                    {ingredientsState.value?.map((ingredient, ingredientIndex) => (
                                      <Fragment
                                        key={`ingredient-${JSON.stringify(ingredient.id)}-${sectionIndex}`}
                                      >
                                        <div className="flex w-full items-start justify-between gap-2 md:flex-row flex-col">
                                          <AppField
                                            name={`sections[${sectionIndex}].ingredients[${ingredientIndex}].id`}
                                          >
                                            {({ ComboboxField }) => (
                                              <ComboboxField
                                                options={ingredientsOptions}
                                                disabled={isSubmitting}
                                                placeholder="Sélectionner un ingrédient"
                                                searchPlaceholder="Rechercher un ingrédient"
                                                emptyContent={(inputValue) => (
                                                  <AddIngredient
                                                    key={ingredientKey}
                                                    defaultValue={inputValue}
                                                    onSuccess={() => setIngredientKey((k) => k + 1)}
                                                  >
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="w-full justify-start font-normal px-1.5"
                                                    >
                                                      <PlusIcon className="size-4" aria-hidden="true" />
                                                      Nouvel ingrédient: {inputValue}
                                                    </Button>
                                                  </AddIngredient>
                                                )}
                                              />
                                            )}
                                          </AppField>
                                          <AppField
                                            name={`sections[${sectionIndex}].ingredients[${ingredientIndex}].quantity`}
                                          >
                                            {({ NumberField }) => (
                                              <NumberField
                                                min={0}
                                                disabled={isSubmitting}
                                                placeholder="Quantité"
                                                decimalScale={3}
                                              />
                                            )}
                                          </AppField>
                                          <AppField
                                            name={`sections[${sectionIndex}].ingredients[${ingredientIndex}].unitId`}
                                          >
                                            {({ ComboboxField }) => (
                                              <ComboboxField
                                                options={unitsOptions}
                                                disabled={isSubmitting}
                                                placeholder="Sélectionner une unité"
                                                searchPlaceholder="Rechercher une unité"
                                                noResultsLabel="Aucune unité trouvée"
                                                emptyContent={(inputValue) => (
                                                  <AddUnit
                                                    key={unitKey}
                                                    defaultValue={inputValue}
                                                    onSuccess={() => setUnitKey((k) => k + 1)}
                                                  >
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="w-full justify-start font-normal px-1.5"
                                                    >
                                                      <PlusIcon className="size-4" aria-hidden="true" />
                                                      Nouvelle unité: {inputValue}
                                                    </Button>
                                                  </AddUnit>
                                                )}
                                              />
                                            )}
                                          </AppField>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            disabled={isSubmitting}
                                            onClick={() => removeIngredient(ingredientIndex)}
                                          >
                                            <TrashIcon className="h-4 w-4" />
                                          </Button>
                                        </div>
                                        <Separator className="md:hidden" />
                                      </Fragment>
                                    ))}
                                    <IngredientFormMessage />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        addIngredient({
                                          id: '',
                                          quantity: 0,
                                        })
                                      }}
                                      size="sm"
                                      disabled={isSubmitting}
                                    >
                                      <PlusIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </AppField>
                            )}
                            <SectionFormMessage />
                          </div>
                        </SectionFormControl>
                      </SectionFormItem>
                    )}
                  </AppField>
                ))}
                <div className="flex w-full gap-2 md:flex-row flex-col">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      addSection({
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
                      addSection({
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
