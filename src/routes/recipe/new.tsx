import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllIngredientsQueryOptions } from '@/features/ingredients/api/get-all'
import { createRecipeMutationQueryOptions, recipeSchema } from '@/features/recipe/api/create'
import { getAllRecipesQueryOptions } from '@/features/recipe/api/get-all'
import { recipeDefaultValues, RecipeForm, recipeFormFields } from '@/features/recipe/recipe-form'
import { useAppForm } from '@/hooks/use-app-form'
import { objectToFormData } from '@/lib/form-data'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

const NewRecipePage = () => {
  const router = useRouter()
  const { mutateAsync: createRecipe } = useMutation(createRecipeMutationQueryOptions)

  const form = useAppForm({
    validators: {
      onDynamic: recipeSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: recipeDefaultValues,
    onSubmit: async (data) => {
      try {
        const parsedData = recipeSchema.parse(data.value)
        const formData = objectToFormData(parsedData)
        await createRecipe({ data: formData })

        await router.navigate({ to: '/' })
      } catch (error) {
        toast.error('Une erreur est survenue lors de la création de la recette', {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        })
      }
    },
  })

  return (
    <>
      <CardHeader className="text-center pt-6">
        <CardTitle className="text-3xl font-bold">Nouvelle Recette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
          className="space-y-6"
        >
          <RecipeForm form={form} fields={recipeFormFields} />
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
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
      </CardContent>
    </>
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
    await context.queryClient.ensureQueryData(getAllIngredientsQueryOptions())
    await context.queryClient.ensureQueryData(getAllRecipesQueryOptions())
  },
})
