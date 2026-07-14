import { revalidateLogic } from '@tanstack/solid-form'
import { useMutation } from '@tanstack/solid-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/solid-router'
import { useSelector } from '@tanstack/solid-store'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { renderAddIngredientOption } from '@/features/ingredients/components/add-ingredient'
import { useIngredientOptions } from '@/features/ingredients/hooks/use-ingredient-options'
import { createRecipeOptions, recipeSchema } from '@/features/recipe/api/create'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { RecipeForm } from '@/features/recipe/components/recipe-form'
import { recipeDefaultValues } from '@/features/recipe/utils/form'
import { useAppForm } from '@/hooks/use-app-form'
import { objectToFormData } from '@/utils/form-data'
import { formatFormErrors } from '@/utils/format-form-errors'

const NewRecipePage = () => {
  const router = useRouter()
  const createMutation = useMutation(() => createRecipeOptions())
  const ingredientOptions = useIngredientOptions()

  const form = useAppForm(() => ({
    defaultValues: recipeDefaultValues,
    onSubmit: async ({ value }) => {
      const formData = objectToFormData(value)
      await createMutation.mutateAsync({ data: formData })
      await router.navigate({ to: '/' })
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: recipeSchema,
    },
  }))

  const errors = useSelector(form.store, (state) => formatFormErrors(state.errors))
  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <ScreenLayout title="Nouvelle Recette" withGoBack>
      <Form
        errors={errors()}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <RecipeForm addNewIngredientOption={renderAddIngredientOption} form={form} ingredientOptions={ingredientOptions} />
        <div class="flex flex-col justify-end gap-4 pt-6 md:flex-row">
          <Button disabled={isSubmitting()} onClick={() => router.navigate({ to: '/' })} type="button" variant="outline">
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
    await context.queryClient.ensureQueryData(getIngredientListOptions())
    await context.queryClient.ensureQueryData(getRecipeListOptions())
  },
})
