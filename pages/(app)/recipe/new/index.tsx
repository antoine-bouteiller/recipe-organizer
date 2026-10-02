import { renderAddIngredientOption } from '@client/features/ingredients/components/add-ingredient'
import { IngredientCatalogProvider } from '@client/features/ingredients/contexts/ingredient-catalog-context'
import { useIngredientOptions } from '@client/features/ingredients/hooks/use-ingredient-options'
import { RecipeForm } from '@client/features/recipe/components/recipe-form'
import { RecipeFormActions } from '@client/features/recipe/components/recipe-form-actions'
import { RecipeCatalogProvider } from '@client/features/recipe/contexts/recipe-catalog-context'
import { recipeDefaultValues, recipeFormFields } from '@client/features/recipe/utils/form'
import { usePageAction } from '@client/lib/page-action'
import { Button } from '@recipe-organizer/design-system/button'
import { Form } from '@recipe-organizer/design-system/form'
import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { GoBackButton, ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { formatFormErrors } from '@recipe-organizer/design-system/utils/format-form-errors'
import { recipeSchema } from '@recipe-organizer/shared/recipe/schemas'
import { objectToFormData } from '@recipe-organizer/shared/utils/form-data'
import { revalidateLogic } from '@tanstack/react-form'
import { useSelector } from '@tanstack/react-store'
import { useRouter } from '@void/react'

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
