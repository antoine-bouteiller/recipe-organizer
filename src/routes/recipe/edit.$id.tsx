import { revalidateLogic, useStore } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, redirect, useRouter } from '@tanstack/react-router'
import { type } from 'arktype'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { getRecipeDetailsOptions, type RecipeIngredientGroup } from '@/features/recipe/api/get-one'
import { type UpdateRecipeFormInput, updateRecipeOptions, updateRecipeSchema } from '@/features/recipe/api/update'
import { RecipeForm } from '@/features/recipe/components/recipe-form'
import { recipeFormFields } from '@/features/recipe/utils/constants'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { useAppForm } from '@/hooks/use-app-form'
import { objectToFormData } from '@/utils/form-data'
import { formatFormErrors } from '@/utils/format-form-errors'
import { getFileUrl } from '@/utils/get-file-url'

const formatIngredientGroup = (group: RecipeIngredientGroup) => ({
  groupName: group.groupName ?? '',
  ingredients: group.groupIngredients.map((ingredient) => ({
    id: ingredient.ingredient.id,
    quantity: ingredient.quantity,
    unitId: ingredient.unit?.id,
  })),
})

const EditRecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe, isLoading } = useQuery(getRecipeDetailsOptions(id))
  const { mutateAsync: updateRecipe } = useMutation(updateRecipeOptions())
  const router = useRouter()

  const initialValues: UpdateRecipeFormInput = recipe
    ? {
        id: recipe.id,
        image: {
          id: recipe.image,
          url: getFileUrl(recipe.image),
        },
        ingredientGroups: recipe.ingredientGroups.map(formatIngredientGroup),
        instructions: recipe.instructions,
        linkedRecipes: recipe.linkedRecipes.map((lr) => ({
          id: lr.linkedRecipe.id,
          ratio: lr.ratio,
        })),
        name: recipe.name,
        servings: recipe.servings,
      }
    : {}

  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const formData = objectToFormData(value)

      await updateRecipe({ data: formData })

      await router.navigate({
        params: { id: id.toString() },
        replace: true,
        to: '/recipe/$id',
      })
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: updateRecipeSchema,
    },
  })

  const errors = useStore(form.store, (state) => formatFormErrors(state.errors as unknown as Record<string, type.errors>[]))

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
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
        className="p-4"
        errors={errors}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <RecipeForm fields={recipeFormFields} form={form} initialImage={{ id: recipe.image, url: getFileUrl(recipe.image) }} />
        <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row">
          <Button disabled={isLoading} onClick={() => router.navigate({ to: '/' })} type="button" variant="outline">
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

const paramsSchema = type({ id: 'string.integer.parse' })

export const Route = createFileRoute('/recipe/edit/$id')({
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ to: '/auth/login' })
    }
  },
  component: EditRecipePage,
  loader: async ({ context, params }) => {
    const validated = paramsSchema(params)
    if (validated instanceof type.errors) {
      throw new Error(validated.summary)
    }
    const { id } = validated
    await context.queryClient.prefetchQuery(getRecipeDetailsOptions(id))
    await context.queryClient.ensureQueryData(getIngredientListOptions())
    await context.queryClient.ensureQueryData(getRecipeListOptions())
    await context.queryClient.ensureQueryData(getUnitsListOptions())

    return { id }
  },
})
