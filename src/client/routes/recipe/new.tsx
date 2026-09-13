import { ScreenLayout } from '@client/components/layout/screen-layout'
import { Button } from '@client/components/ui/button'
import { Form } from '@client/components/ui/form'
import { getIngredientListOptions } from '@client/features/ingredients/api/get-all'
import { renderAddIngredientOption } from '@client/features/ingredients/components/add-ingredient'
import { useIngredientOptions } from '@client/features/ingredients/hooks/use-ingredient-options'
import { createRecipeOptions, recipeSchema } from '@client/features/recipe/api/create'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { RecipeForm } from '@client/features/recipe/components/recipe-form'
import { recipeDefaultValues, recipeFormFields } from '@client/features/recipe/utils/form'
import { useAppForm } from '@client/hooks/use-app-form'
import { formatFormErrors } from '@client/utils/format-form-errors'
import { objectToFormData } from '@shared/utils/form-data'
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
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <RecipeForm addNewIngredientOption={renderAddIngredientOption} fields={recipeFormFields} form={form} ingredientOptions={ingredientOptions} />
        <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row">
          <Button disabled={form.state.isSubmitting} onClick={() => router.navigate({ to: '/' })} type="button" variant="outline">
            Annuler
          </Button>
          <form.AppForm>
            <form.FormSubmit label="Créer la recette" />
          </form.AppForm>
        </div>
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
