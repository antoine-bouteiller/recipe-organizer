import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { createRecipeOptions, recipeSchema } from '@/features/recipe/api/create'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { RecipeForm } from '@/features/recipe/components/recipe-form'
import { recipeDefaultValues, recipeFormFields } from '@/features/recipe/constants'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { useAppForm } from '@/hooks/use-app-form'
import { objectToFormData } from '@/utils/form-data'
import { formatFormErrors } from '@/utils/format-form-errors'
import { revalidateLogic, useStore } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

const NewRecipePage = () => {
  const router = useRouter()
  const { mutateAsync: createRecipe } = useMutation(createRecipeOptions())

  const form = useAppForm({
    validators: {
      onDynamic: recipeSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: recipeDefaultValues,
    onSubmit: async ({ value }) => {
      const formData = objectToFormData(value)
      await createRecipe({ data: formData })

      await router.navigate({ to: '/' })
    },
  })

  const errors = useStore(form.store, (state) => formatFormErrors(state.errors))

  return (
    <ScreenLayout title="Nouvelle Recette" withGoBack>
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
        errors={errors}
        className="p-4"
      >
        <RecipeForm form={form} fields={recipeFormFields} />
        <div className="flex gap-4 pt-6 md:flex-row flex-col justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.navigate({ to: '/' })}
            disabled={form.state.isSubmitting}
          >
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
  component: NewRecipePage,
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ to: '/auth/login', from: '/recipe/new' })
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getIngredientListOptions())
    await context.queryClient.ensureQueryData(getRecipeListOptions())
    await context.queryClient.ensureQueryData(getUnitsListOptions())
  },
})
