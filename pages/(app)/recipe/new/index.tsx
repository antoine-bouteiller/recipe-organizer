import { revalidateLogic } from '@tanstack/react-form'
import { useSelector } from '@tanstack/react-store'
import { useRouter } from '@void/react'

import { useAppForm } from '@/design-system/hooks/use-app-form'
import { Button } from '@/design-system/ui/actions/button/button'
import { Form } from '@/design-system/ui/forms/form/form'
import { GoBackButton, ScreenLayout } from '@/design-system/ui/layout/screen-layout/screen-layout'
import { formatFormErrors } from '@/design-system/utils/format-form-errors'
import { renderAddIngredientOption } from '@/features/ingredients/client/components/add-ingredient'
import { IngredientCatalogProvider } from '@/features/ingredients/client/contexts/ingredient-catalog-context'
import { useIngredientOptions } from '@/features/ingredients/client/hooks/use-ingredient-options'
import { RecipeForm } from '@/features/recipe/client/components/recipe-form'
import { RecipeFormActions } from '@/features/recipe/client/components/recipe-form-actions'
import { RecipeCatalogProvider } from '@/features/recipe/client/contexts/recipe-catalog-context'
import { recipeDefaultValues, recipeFormFields } from '@/features/recipe/client/utils/form'
import { recipeSchema } from '@/features/recipe/schemas'
import { usePageAction } from '@/lib/client/page-action'
import { objectToFormData } from '@/utils/form-data'

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
  const runPageAction = usePageAction()
  const router = useRouter()
  const ingredientOptions = useIngredientOptions()

  const form = useAppForm({
    defaultValues: recipeDefaultValues,
    onSubmit: async ({ value }) => {
      const succeeded = await runPageAction(
        '/recipe/new',
        { data: Object.fromEntries(objectToFormData(value)) },
        `Erreur lors de la création de la recette ${value.name ?? ''}`
      )
      if (succeeded) {
        await router.visit('/')
      }
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: recipeSchema,
    },
  })

  const errors = useSelector(form.store, (state) => formatFormErrors(state.errors))

  return (
    <ScreenLayout title="Nouvelle Recette" backButton={<GoBackButton />}>
      <Form
        errors={errors}
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <RecipeForm addNewIngredientOption={renderAddIngredientOption} fields={recipeFormFields} form={form} ingredientOptions={ingredientOptions} />
        <RecipeFormActions>
          <Button disabled={form.state.isSubmitting} onClick={() => router.visit('/')} type="button" variant="outline">
            Annuler
          </Button>
          <form.AppForm>
            <form.FormSubmit label="Créer la recette" />
          </form.AppForm>
        </RecipeFormActions>
      </Form>
    </ScreenLayout>
  )
}
