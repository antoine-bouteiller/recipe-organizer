import { revalidateLogic, useStore } from '@tanstack/react-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { z } from 'zod'

import { NotFound } from '@/components/error/not-found'
import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { getRecipeDetailsOptions, type RecipeIngredientGroup } from '@/features/recipe/api/get-one'
import { updateRecipeOptions, updateRecipeSchema, type UpdateRecipeFormInput } from '@/features/recipe/api/update'
import { RecipeForm } from '@/features/recipe/components/recipe-form'
import { AUTO_TAGS, type RECIPE_TAGS } from '@/features/recipe/utils/constants'
import { recipeFormFields } from '@/features/recipe/utils/form'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { useAppForm } from '@/hooks/use-app-form'
import { objectToFormData } from '@/utils/form-data'
import { formatFormErrors } from '@/utils/format-form-errors'
import { getVideoUrl } from '@/utils/get-file-url'

const formatIngredientGroup = (group: RecipeIngredientGroup) => ({
  _key: Math.random().toString(36).substring(7),
  groupName: group.groupName ?? '',
  ingredients: group.groupIngredients.map((ingredient) => ({
    _key: Math.random().toString(36).substring(7),
    id: ingredient.ingredient.id,
    quantity: ingredient.quantity,
    unitId: ingredient.unit?.id,
  })),
})

const EditRecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe, isLoading } = useSuspenseQuery(getRecipeDetailsOptions(id))
  const { mutateAsync: updateRecipe } = useMutation(updateRecipeOptions())
  const router = useRouter()

  const initialValues: UpdateRecipeFormInput = recipe
    ? {
        id: recipe.id,
        image: {
          id: recipe.image,
          url: recipe.image,
        },
        ingredientGroups: recipe.ingredientGroups.map(formatIngredientGroup),
        instructions: recipe.instructions,
        linkedRecipes: recipe.linkedRecipes.map((linkedRecipe) => ({
          id: linkedRecipe.linkedRecipe.id,
          ratio: linkedRecipe.ratio,
        })),
        name: recipe.name,
        servings: recipe.servings,
        tags: recipe.tags.filter((tag) => !AUTO_TAGS.includes(tag as (typeof AUTO_TAGS)[number])) as (typeof RECIPE_TAGS)[number][],
        video: recipe.video
          ? {
              id: recipe.video,
              url: getVideoUrl(recipe.video),
            }
          : undefined,
      }
    : {}

  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const formData = objectToFormData(value)

      await updateRecipe({ data: formData })

      router.history.back()
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: updateRecipeSchema,
    },
  })

  const errors = useStore(form.store, (state) => formatFormErrors(state.errors))

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!recipe) {
    return <NotFound />
  }

  return (
    <ScreenLayout title="Modifier la recette" withGoBack>
      <Form
        className="p-4"
        errors={errors}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <RecipeForm
          fields={recipeFormFields}
          form={form}
          id={recipe.id}
          initialImage={{ id: recipe.image, url: recipe.image }}
          initialVideo={recipe.video ? { id: recipe.video, url: getVideoUrl(recipe.video) } : undefined}
        />
        <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row">
          <Button disabled={isLoading} onClick={() => router.history.back()} type="button" variant="outline">
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

const paramsSchema = z.object({
  id: z.string().transform((str) => Number.parseInt(str, 10)),
})

export const Route = createFileRoute('/recipe/edit/$id')({
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ to: '/auth/login' })
    }
  },
  component: EditRecipePage,
  loader: async ({ context, params }) => {
    const result = paramsSchema.safeParse(params)
    if (!result.success) {
      throw new Error(result.error?.issues[0]?.message ?? 'Invalid id')
    }
    const { id } = result.data
    await context.queryClient.ensureQueryData(getRecipeDetailsOptions(id))
    await context.queryClient.ensureQueryData(getIngredientListOptions())
    await context.queryClient.ensureQueryData(getRecipeListOptions())
    await context.queryClient.ensureQueryData(getUnitsListOptions())

    return { id }
  },
})
