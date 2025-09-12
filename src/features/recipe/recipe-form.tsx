import { Button } from '@/components/ui/button'
import { getAllIngredientsQueryOptions } from '@/features/ingredients/api/get-all'
import AddExistingRecipe from '@/features/recipe/add-existing-recipe'
import { type RecipeFormInput } from '@/features/recipe/api/create'
import { withFieldGroup } from '@/hooks/use-app-form'
import { units } from '@/types/units'
import { Separator } from '@radix-ui/react-separator'
import { createFieldMap, useStore } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Fragment } from 'react/jsx-runtime'

const unitsOptions = units.map((unit) => ({
  label: unit,
  value: unit,
}))

export const recipeDefaultValues: RecipeFormInput = {
  name: '',
  steps: '',
  image: undefined,
  ingredientsSections: [
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

const hasSubRecipe = (
  section: NonNullable<RecipeFormInput['ingredientsSections']>[number] | undefined
) => section && 'recipeId' in section && !!section.recipeId

export const recipeFormFields = createFieldMap(recipeDefaultValues)

interface RecipeFormProps extends Record<string, unknown> {
  imagePreview?: string
}

export const RecipeForm = withFieldGroup({
  defaultValues: recipeDefaultValues,
  props: {
    imagePreview: '' as string | undefined,
  } as RecipeFormProps,
  render: function Render({ group, imagePreview }) {
    const { data: ingredients } = useQuery(getAllIngredientsQueryOptions())

    const ingredientsOptions = useMemo(
      () =>
        ingredients?.map((ingredient) => ({
          label: ingredient.name,
          value: ingredient.id.toString(),
        })) ?? [],
      [ingredients]
    )

    const { AppField, Field } = group

    const isSubmitting = useStore(group.form.store, (state) => state.isSubmitting)

    return (
      <>
        <AppField
          name="name"
          children={(field) => (
            <field.TextField label="Nom de la recette" disabled={isSubmitting} />
          )}
        />

        <AppField
          name="image"
          children={({ ImageField }) => (
            <ImageField
              label="Photo de la recette"
              disabled={isSubmitting}
              initialPreview={imagePreview}
            />
          )}
        />

        <div className="flex flex-col gap-2 pt-2">
          <div className="text-base font-semibold">Ingrédients</div>
          <Field
            name="ingredientsSections"
            mode="array"
            children={({
              state: sectionsState,
              removeValue: removeSection,
              pushValue: addSection,
            }) => (
              <>
                {sectionsState.value?.map((_, sectionIndex) => (
                  <AppField
                    name={`ingredientsSections[${sectionIndex}]`}
                    key={`section-${sectionIndex}`}
                  >
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
                                <AppField
                                  name={`ingredientsSections[${sectionIndex}].name`}
                                  children={({ TextField }) => (
                                    <TextField label="Nom" disabled={isSubmitting} />
                                  )}
                                />
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
                              <AppField
                                name={`ingredientsSections[${sectionIndex}].ingredients`}
                                mode="array"
                              >
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
                                            name={`ingredientsSections[${sectionIndex}].ingredients[${ingredientIndex}].id`}
                                            children={({ SearchSelectField }) => (
                                              <SearchSelectField
                                                options={ingredientsOptions}
                                                disabled={isSubmitting}
                                              />
                                            )}
                                          />
                                          <AppField
                                            name={`ingredientsSections[${sectionIndex}].ingredients[${ingredientIndex}].quantity`}
                                            children={({ NumberField }) => (
                                              <NumberField
                                                min={0}
                                                decimalScale={1}
                                                disabled={isSubmitting}
                                              />
                                            )}
                                          />
                                          <AppField
                                            name={`ingredientsSections[${sectionIndex}].ingredients[${ingredientIndex}].unit`}
                                            children={({ SearchSelectField }) => (
                                              <SearchSelectField
                                                options={unitsOptions}
                                                disabled={isSubmitting}
                                              />
                                            )}
                                          />
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
          />
        </div>

        <AppField
          name="steps"
          children={({ TiptapField }) => <TiptapField label="Étapes" disabled={isSubmitting} />}
        />
      </>
    )
  },
})
