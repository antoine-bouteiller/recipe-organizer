import { getIngredientListOptions } from '@client/features/ingredients/api/get-all'
import { renderAddIngredientOption } from '@client/features/ingredients/components/add-ingredient'
import { useIngredientOptions } from '@client/features/ingredients/hooks/use-ingredient-options'
import { createRecipeOptions, recipeSchema } from '@client/features/recipe/api/create'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { RecipeForm } from '@client/features/recipe/components/recipe-form'
import { RecipeFormActions } from '@client/features/recipe/components/recipe-form-actions'
import { recipeDefaultValues, recipeFormFields } from '@client/features/recipe/utils/form'
import { Button } from '@recipe-organizer/design-system/button'
import { Form } from '@recipe-organizer/design-system/form'
import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { formatFormErrors } from '@recipe-organizer/design-system/utils/format-form-errors'
import { objectToFormData } from '@recipe-organizer/shared/utils/form-data'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useSelector } from '@tanstack/react-store'

const NewRecipePage = () => {
  const router = useRouter()
  const { mutateAsync: createRecipe } = useMutation(createRecipeOptions())
  const ingredientOptions = useIngredientOptions()

  const form = useAppForm({
    defaultValues: recipeDefaultValues,
    onSubmit: async ({ value }) => {
      const formData = objectToFormData(value)
      await createRecipe({ data: formData })

      await router.navigate({ to: '/' })
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: recipeSchema,
    },
  })

  const errors = useSelector(form.store, (state) => formatFormErrors(state.errors))

  return (
    <ScreenLayout title="Nouvelle Recette" withGoBack>
      <Form
        errors={errors}
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <RecipeForm addNewIngredientOption={renderAddIngredientOption} fields={recipeFormFields} form={form} ingredientOptions={ingredientOptions} />
        <RecipeFormActions>
          <Button disabled={form.state.isSubmitting} onClick={() => router.navigate({ to: '/' })} type="button" variant="outline">
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

export const Route = createFileRoute('/recipe/new')({
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ from: '/recipe/new', to: '/auth/login' })
    }
  },
  component: NewRecipePage,
  loader: async ({ context }) => {
    await context.queryClient.query({ ...getIngredientListOptions(), staleTime: 'static' })
    await context.queryClient.query({ ...getRecipeListOptions(), staleTime: 'static' })
  },
})
