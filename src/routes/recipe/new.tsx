import { ScreenLayout } from '@/components/screen-layout'
import { Button } from '@/components/ui/button'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { createRecipeOptions, recipeSchema } from '@/features/recipe/api/create'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { recipeDefaultValues, RecipeForm, recipeFormFields } from '@/features/recipe/recipe-form'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { useAppForm } from '@/hooks/use-app-form'
import { objectToFormData } from '@/lib/form-data'
import { revalidateLogic } from '@tanstack/react-form'
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

  return (
    <ScreenLayout title="Nouvelle Recette" withGoBack>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
        className="space-y-6"
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
      </form>
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
