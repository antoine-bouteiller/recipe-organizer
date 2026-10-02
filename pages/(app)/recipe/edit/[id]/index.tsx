import { renderAddIngredientOption } from '@client/features/ingredients/components/add-ingredient'
import { IngredientCatalogProvider } from '@client/features/ingredients/contexts/ingredient-catalog-context'
import { useIngredientOptions } from '@client/features/ingredients/hooks/use-ingredient-options'
import type { Recipe, RecipeIngredientGroup } from '@client/features/recipe/api/get-one'
import { RecipeForm } from '@client/features/recipe/components/recipe-form'
import { RecipeFormActions } from '@client/features/recipe/components/recipe-form-actions'
import { RecipeCatalogProvider } from '@client/features/recipe/contexts/recipe-catalog-context'
import { recipeFormFields } from '@client/features/recipe/utils/form'
import { usePageAction } from '@client/lib/page-action'
import { Button } from '@recipe-organizer/design-system/button'
import { Form } from '@recipe-organizer/design-system/form'
import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { NotFound } from '@recipe-organizer/design-system/not-found'
import { GoBackButton, ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { formatFormErrors } from '@recipe-organizer/design-system/utils/format-form-errors'
import { updateRecipeSchema } from '@recipe-organizer/shared/recipe/schemas'
import type { UpdateRecipeFormInput } from '@recipe-organizer/shared/recipe/schemas'
import { objectToFormData } from '@recipe-organizer/shared/utils/form-data'
import { getVideoUrl } from '@recipe-organizer/shared/utils/get-file-url'
import { revalidateLogic } from '@tanstack/react-form'
import { useSelector } from '@tanstack/react-store'

import type { Props } from './index.server'

const formatIngredientGroup = (group: RecipeIngredientGroup) => ({
  _key: Math.random().toString(36).substring(7),
  groupName: group.groupName ?? '',
  ingredients: group.groupIngredients.map((ingredient) => ({
    _key: Math.random().toString(36).substring(7),
    id: ingredient.ingredient.id,
    quantity: ingredient.quantity,
    unitSlug: ingredient.unitSlug ?? undefined,
  })),
})

const newKey = () => Math.random().toString(36).substring(7)

const formatStepGroup = (group: Recipe['stepGroups'][number]) =>
  group.kind === 'steps'
    ? { ...group, _key: newKey(), steps: group.steps.map((step) => ({ ...step, _key: newKey() })) }
    : { ...group, _key: newKey() }

export default function EditRecipePage({ ingredients, recipe, recipes }: Props) {
  if (!recipe) {
    return <NotFound />
  }
  return (
    <IngredientCatalogProvider ingredients={ingredients}>
      <RecipeCatalogProvider recipes={recipes}>
        <EditRecipeForm key={recipe.id} recipe={recipe} />
      </RecipeCatalogProvider>
    </IngredientCatalogProvider>
  )
}

const EditRecipeForm = ({ recipe }: { recipe: Recipe }) => {
  const runPageAction = usePageAction()
  const ingredientOptions = useIngredientOptions()

  const initialValues: UpdateRecipeFormInput = {
    cuisineTypes: recipe.cuisineTypes,
    id: recipe.id,
    image: {
      id: recipe.image,
      url: recipe.image,
    },
    ingredientGroups: recipe.ingredientGroups.map(formatIngredientGroup),
    linkedRecipes: recipe.linkedRecipes.map((linkedRecipe) => ({
      id: linkedRecipe.linkedRecipe.id,
      ratio: linkedRecipe.ratio,
    })),
    meals: recipe.meals,
    name: recipe.name,
    servings: recipe.servings,
    stepGroups: recipe.stepGroups.map(formatStepGroup),
    video: recipe.video
      ? {
          id: recipe.video,
          url: getVideoUrl(recipe.video),
        }
      : undefined,
  }

  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const succeeded = await runPageAction(
        '/recipe/edit/:id',
        { data: Object.fromEntries(objectToFormData(value)), params: { id: String(recipe.id) } },
        `Erreur lors de la mise à jour de la recette ${value.name ?? ''}`
      )
      if (succeeded) {
        history.back()
      }
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: updateRecipeSchema,
    },
  })

  const errors = useSelector(form.store, (state) => formatFormErrors(state.errors))

  return (
    <ScreenLayout title="Modifier la recette" backButton={<GoBackButton />}>
      <Form
        errors={errors}
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <RecipeForm
          addNewIngredientOption={renderAddIngredientOption}
          fields={recipeFormFields}
          form={form}
          id={recipe.id}
          ingredientOptions={ingredientOptions}
          initialImage={{ id: recipe.image, url: recipe.image }}
          initialVideo={recipe.video ? { id: recipe.video, url: getVideoUrl(recipe.video) } : undefined}
        />
        <RecipeFormActions>
          <Button disabled={form.state.isSubmitting} onClick={() => history.back()} type="button" variant="outline">
            Annuler
          </Button>
          <form.AppForm>
            <form.FormSubmit label="Modifier la recette" />
          </form.AppForm>
        </RecipeFormActions>
      </Form>
    </ScreenLayout>
  )
}
