import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { getAllIngredientsQueryOptions } from '@/features/ingredients/api/get-all'
import {
  editRecipeSchema,
  useEditRecipeMutation,
  type EditRecipeFormInput,
} from '@/features/recipe/api/edit'
import { getAllRecipesQueryOptions } from '@/features/recipe/api/get-all'
import {
  getRecipeQueryOptions,
  useGetRecipe,
  type RecipeSection,
} from '@/features/recipe/api/get-one'
import { RecipeForm, recipeFormFields } from '@/features/recipe/recipe-form'
import { useAppForm } from '@/hooks/use-app-form'
import { objectToFormData } from '@/lib/form-data'
import { getFileUrl } from '@/lib/utils'
import { isUnit } from '@/types/units'
import { revalidateLogic } from '@tanstack/react-form'
import { createFileRoute, notFound, redirect, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

const formatSection = (sections: RecipeSection) => {
  if (sections.subRecipeId) {
    return {
      name: sections.name ?? '',
      ratio: sections.ratio ?? 1,
      recipeId: sections.subRecipeId.toString(),
    }
  }
  return {
    name: sections.name ?? '',
    ingredients: sections.sectionIngredients.map((ingredient) => ({
      id: ingredient.ingredient.id.toString(),
      quantity: ingredient.quantity,
      unit: isUnit(ingredient.unit) ? ingredient.unit : undefined,
    })),
  }
}

const EditRecipePage = () => {
  const { id } = Route.useParams()
  const { data: recipe, isLoading } = useGetRecipe(id)
  const { mutateAsync: editRecipe } = useEditRecipeMutation()
  const router = useRouter()

  const initialValues: EditRecipeFormInput = recipe
    ? {
        id: recipe.id,
        name: recipe.name,
        steps: recipe.steps,
        quantity: recipe.quantity,
        sections: recipe.sections.map(formatSection),
        image: {
          id: recipe.image,
          url: getFileUrl(recipe.image),
        },
      }
    : {}

  const form = useAppForm({
    validators: {
      onDynamic: editRecipeSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: initialValues,
    onSubmit: async (data) => {
      try {
        const parsedData = editRecipeSchema.parse(data.value)
        const formData = objectToFormData(parsedData)

        await editRecipe({ data: formData })

        await router.navigate({ to: '/' })
      } catch (error) {
        toast.error('Une erreur est survenue lors de la création de la recette', {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        })
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (!recipe) {
    return notFound()
  }

  return (
    <>
      <CardHeader className="text-center pt-6">
        <CardTitle className="text-3xl font-bold">Modifier la recette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
          className="space-y-6"
        >
          <RecipeForm
            form={form}
            fields={recipeFormFields}
            initialImage={{ id: recipe.image, url: getFileUrl(recipe.image) }}
          />
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.navigate({ to: '/' })}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <form.AppForm>
              <form.FormSubmit label="Modifier la recette" />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </>
  )
}

export const Route = createFileRoute('/recipe/edit/$id')({
  component: EditRecipePage,
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ to: '/auth/login' })
    }
  },
  loader: async ({ params, context }) => {
    await context.queryClient.prefetchQuery(getRecipeQueryOptions(params.id))
    await context.queryClient.ensureQueryData(getAllIngredientsQueryOptions)
    await context.queryClient.ensureQueryData(getAllRecipesQueryOptions())
  },
})
