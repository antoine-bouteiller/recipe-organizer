import { useForm, useRouter } from '@void/react'
import { useEffect } from 'react'

import { GoBackButton, ScreenLayout } from '@/components/screen-layout/screen-layout'
import { Button } from '@/components/ui/actions/button/button'
import { FormSubmit } from '@/components/ui/forms/form-submit/form-submit'
import { Form } from '@/components/ui/forms/form/form'
import { renderAddIngredientOption } from '@/features/ingredients/client/components/add-ingredient'
import { IngredientCatalogProvider } from '@/features/ingredients/client/contexts/ingredient-catalog-context'
import { useIngredientOptions } from '@/features/ingredients/client/hooks/use-ingredient-options'
import { RecipeForm } from '@/features/recipe/client/components/recipe-form'
import { RecipeFormActions } from '@/features/recipe/client/components/recipe-form-actions'
import { RecipeCatalogProvider } from '@/features/recipe/client/contexts/recipe-catalog-context'
import { recipeDefaultValues } from '@/features/recipe/client/utils/form'
import { useFormActionError } from '@/lib/client/page-action'

import type { Props } from './index.server'

export default function NewRecipePage({ ingredients, recipes }: Props) {
  return (
    <IngredientCatalogProvider ingredients={ingredients}>
      <RecipeCatalogProvider recipes={recipes}>
        <NewRecipeForm />
      </RecipeCatalogProvider>
    </IngredientCatalogProvider>
  )
}

const NewRecipeForm = () => {
  const router = useRouter()
  const ingredientOptions = useIngredientOptions()

  const form = useForm('/recipe/new', recipeDefaultValues)
  useFormActionError(form.error, `Erreur lors de la création de la recette ${form.data.name ?? ''}`)
  useEffect(() => {
    if (form.wasSuccessful) {
      void router.visit('/', { replace: true })
    }
  }, [form.wasSuccessful, router])

  return (
    <ScreenLayout title="Nouvelle Recette" backButton={<GoBackButton />}>
      <Form errors={form.errors} action={(data) => form.post(data)}>
        <RecipeForm addNewIngredientOption={renderAddIngredientOption} form={form} ingredientOptions={ingredientOptions} />
        <RecipeFormActions>
          <Button disabled={form.pending} onClick={() => router.visit('/')} type="button" variant="outline">
            Annuler
          </Button>
          <FormSubmit pending={form.pending} label="Créer la recette" />
        </RecipeFormActions>
      </Form>
    </ScreenLayout>
  )
}
