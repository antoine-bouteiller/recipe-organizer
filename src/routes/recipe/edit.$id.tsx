import { revalidateLogic, useStore } from '@tanstack/react-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import * as v from 'valibot'

import type { RECIPE_TAGS } from '@/features/recipe/utils/constants'

import { NotFound } from '@/components/error/not-found'
import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { getRecipeDetailsOptions, type RecipeIngredientGroup } from '@/features/recipe/api/get-one'
import { updateRecipeOptions, updateRecipeSchema, type UpdateRecipeFormInput } from '@/features/recipe/api/update'
import { RecipeForm } from '@/features/recipe/components/recipe-form'
import { AUTO_TAGS, recipeFormFields } from '@/features/recipe/utils/constants'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { useAppForm } from '@/hooks/use-app-form'
import { objectToFormData } from '@/utils/form-data'
import { formatFormErrors } from '@/utils/format-form-errors'
import { getVideoUrl } from '@/utils/get-file-url'

const formatIngredientGroup = (group: RecipeIngredientGroup) => ({
  _key: crypto.randomUUID(),
  groupName: group.groupName ?? '',
  ingredients: group.groupIngredients.map((ingredient) => ({
    id: ingredient.ingredient.id,
    quantity: ingredient.quantity,
    unitId: ingredient.unit?.id,
  })),
})

const EditRecipePending = () => (
  <ScreenLayout title="Modifier la recette" withGoBack>
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-48" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-48 w-full" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-48 w-full" />
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Skeleton className="h-4 w-44" />
        <div className="flex flex-col gap-4 rounded-xl border p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-9 w-44" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-64 w-full" />
      </div>

      <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row">
        <Skeleton className="h-10 w-full md:w-32" />
        <Skeleton className="h-10 w-full md:w-40" />
      </div>
    </div>
  </ScreenLayout>
)

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

const paramsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.transform((s) => Number.parseInt(s, 10))
  ),
})

export const Route = createFileRoute('/recipe/edit/$id')({
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ to: '/auth/login' })
    }
  },
  component: EditRecipePage,
  loader: async ({ context, params }) => {
    const result = v.safeParse(paramsSchema, params)
    if (!result.success) {
      throw new Error(result.issues[0]?.message ?? 'Invalid id')
    }
    const { id } = result.output
    await context.queryClient.ensureQueryData(getRecipeDetailsOptions(id))
    await context.queryClient.ensureQueryData(getIngredientListOptions())
    await context.queryClient.ensureQueryData(getRecipeListOptions())
    await context.queryClient.ensureQueryData(getUnitsListOptions())

    return { id }
  },
  pendingComponent: EditRecipePending,
})
