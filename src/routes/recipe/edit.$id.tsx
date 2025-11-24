import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { getRecipeDetailsOptions, type RecipeSection } from '@/features/recipe/api/get-one'
import {
  updateRecipeOptions,
  updateRecipeSchema,
  type UpdateRecipeFormInput,
} from '@/features/recipe/api/update'
import { RecipeForm } from '@/features/recipe/components/recipe-form'
import { recipeFormFields } from '@/features/recipe/utils/constants'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { useAppForm } from '@/hooks/use-app-form'
import { objectToFormData } from '@/utils/form-data'
import { formatFormErrors } from '@/utils/format-form-errors'
import { getFileUrl } from '@/utils/get-file-url'
import { revalidateLogic, useStore } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, redirect, useRouter } from '@tanstack/react-router'
import { useMemo } from 'react'
import { z } from 'zod'

const formatSection = (sections: RecipeSection) => {
  if (sections.subRecipeId) {
    return {
      name: sections.name ?? '',
      ratio: sections.ratio ?? 1,
      recipeId: sections.subRecipeId,
    }
  }
  return {
    name: sections.name ?? '',
    ingredients: sections.sectionIngredients.map((ingredient) => ({
      id: ingredient.ingredient.id,
      quantity: ingredient.quantity,
      unitId: ingredient.unit?.id,
    })),
  }
}

const EditRecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe, isLoading } = useQuery(getRecipeDetailsOptions(id))
  const { mutateAsync: updateRecipe } = useMutation(updateRecipeOptions())
  const router = useRouter()

  const initialValues: UpdateRecipeFormInput = useMemo(
    () =>
      recipe
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
        : {},
    [recipe]
  )

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

  const errors = useStore(form.store, (state) => formatFormErrors(state.errors))

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
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
        className="p-4"
        errors={errors}
        noValidate
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
      </Form>
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
