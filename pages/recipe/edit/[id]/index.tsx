import { useForm, useRouter } from '@void/react'
import { useEffect } from 'react'

import { NotFound } from '@/components/not-found/not-found'
import { GoBackButton, ScreenLayout } from '@/components/screen-layout/screen-layout'
import { Button } from '@/components/ui/actions/button/button'
import { FormSubmit } from '@/components/ui/forms/form-submit/form-submit'
import { Form } from '@/components/ui/forms/form/form'
import { renderAddIngredientOption } from '@/features/ingredients/client/components/add-ingredient'
import { IngredientCatalogProvider } from '@/features/ingredients/client/contexts/ingredient-catalog-context'
import { useIngredientOptions } from '@/features/ingredients/client/hooks/use-ingredient-options'
import type { Recipe, RecipeIngredientGroup } from '@/features/recipe/client/api/get-one'
import { RecipeForm } from '@/features/recipe/client/components/recipe-form'
import { RecipeFormActions } from '@/features/recipe/client/components/recipe-form-actions'
import { RecipeCatalogProvider } from '@/features/recipe/client/contexts/recipe-catalog-context'
import type { UpdateRecipeFormInput } from '@/features/recipe/schemas'
import { useFormActionError } from '@/lib/client/page-action'
import { getVideoUrl } from '@/utils/get-file-url'

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
  const router = useRouter()
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
      _key: newKey(),
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

  const form = useForm('/recipe/edit/:id', initialValues, { params: { id: String(recipe.id) } })
  useFormActionError(form.error, `Erreur lors de la mise à jour de la recette ${form.data.name ?? ''}`)
  useEffect(() => {
    if (form.wasSuccessful) {
      void router.visit(`/recipe/${recipe.id}`, { replace: true })
    }
  }, [form.wasSuccessful, recipe.id, router])

  return (
    <ScreenLayout title="Modifier la recette" backButton={<GoBackButton />}>
      <Form errors={form.errors} action={(data) => form.post(data)}>
        <RecipeForm
          addNewIngredientOption={renderAddIngredientOption}
          form={form}
          id={recipe.id}
          ingredientOptions={ingredientOptions}
          initialImage={{ id: recipe.image, url: recipe.image }}
          initialVideo={recipe.video ? { id: recipe.video, url: getVideoUrl(recipe.video) } : undefined}
        />
        <RecipeFormActions>
          <Button disabled={form.pending} onClick={() => history.back()} type="button" variant="outline">
            Annuler
          </Button>
          <FormSubmit pending={form.pending} label="Modifier la recette" />
        </RecipeFormActions>
      </Form>
    </ScreenLayout>
  )
}
