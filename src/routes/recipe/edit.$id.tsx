import { ScreenLayout } from '@/components/screen-layout'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { getRecipeDetailsOptions, type RecipeSection } from '@/features/recipe/api/get-one'
import {
  updateRecipeOptions,
  updateRecipeSchema,
  type UpdateRecipeFormInput,
} from '@/features/recipe/api/update'
import { RecipeForm, recipeFormFields } from '@/features/recipe/recipe-form'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { useAppForm } from '@/hooks/use-app-form'
import { objectToFormData } from '@/lib/form-data'
import { getFileUrl } from '@/lib/utils'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, redirect, useRouter } from '@tanstack/react-router'
import z from 'zod'

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
      unitId: ingredient.unit?.id.toString(),
    })),
  }
}

const EditRecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe, isLoading } = useQuery(getRecipeDetailsOptions(id))
  const { mutateAsync: updateRecipe } = useMutation(updateRecipeOptions())
  const router = useRouter()

  const initialValues: UpdateRecipeFormInput = recipe
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
      onDynamic: updateRecipeSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const formData = objectToFormData(value)

      await updateRecipe({ data: formData })

      await router.navigate({
        to: '/recipe/$id',
        params: { id: id.toString() },
        replace: true,
      })
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
    <ScreenLayout title=" Modifier la recette" withGoBack>
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
        <div className="flex gap-4 pt-6 md:flex-row flex-col justify-end">
          <Button
            type="button"
            variant="outline"
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
    </ScreenLayout>
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
    const { id } = z.object({ id: z.coerce.number() }).parse(params)
    await context.queryClient.prefetchQuery(getRecipeDetailsOptions(id))
    await context.queryClient.ensureQueryData(getIngredientListOptions())
    await context.queryClient.ensureQueryData(getRecipeListOptions())
    await context.queryClient.ensureQueryData(getUnitsListOptions())

    return { id }
  },
})
