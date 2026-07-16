import { revalidateLogic } from '@tanstack/solid-form'
import { useMutation, useQuery } from '@tanstack/solid-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/solid-router'
import { useSelector } from '@tanstack/solid-store'
import { Show } from 'solid-js'
import * as v from 'valibot'

import { NotFound } from '@/components/error/not-found'
import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { renderAddIngredientOption } from '@/features/ingredients/components/add-ingredient'
import { useIngredientOptions } from '@/features/ingredients/hooks/use-ingredient-options'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { getRecipeDetailsOptions, type Recipe as RecipeDetail, type RecipeIngredientGroup } from '@/features/recipe/api/get-one'
import { updateRecipeOptions, updateRecipeSchema, type UpdateRecipeFormInput } from '@/features/recipe/api/update'
import { RecipeForm } from '@/features/recipe/components/recipe-form'
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
    unitSlug: ingredient.unitSlug ?? undefined,
  })),
})

const buildInitialValues = (recipe: RecipeDetail | undefined): UpdateRecipeFormInput | Record<string, never> =>
  recipe
    ? {
        cuisineTypes: recipe.cuisineTypes,
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
        meals: recipe.meals,
        name: recipe.name,
        servings: recipe.servings,
        video: recipe.video
          ? {
              id: recipe.video,
              url: getVideoUrl(recipe.video),
            }
          : undefined,
      }
    : {}

const EditRecipePage = () => {
  const loaderData = Route.useLoaderData()
  const query = useQuery(() => getRecipeDetailsOptions(loaderData().id))
  const updateMutation = useMutation(() => updateRecipeOptions())
  const router = useRouter()
  const ingredientOptions = useIngredientOptions()

  const form = useAppForm(() => ({
    defaultValues: buildInitialValues(query.data),
    onSubmit: async ({ value }) => {
      const formData = objectToFormData(value)
      await updateMutation.mutateAsync({ data: formData })
      router.history.back()
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: updateRecipeSchema,
    },
  }))

  const errors = useSelector(form.store, (state) => formatFormErrors(state.errors))
  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <ScreenLayout title="Modifier la recette" withGoBack>
      <Show when={query.data} fallback={<NotFound />}>
        {(recipe) => {
          const data = recipe()

          return (
            <Form
              errors={errors()}
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                void form.handleSubmit()
              }}
            >
              <RecipeForm
                addNewIngredientOption={renderAddIngredientOption}
                form={form}
                id={data.id}
                ingredientOptions={ingredientOptions()}
                initialImage={data.image ? { id: data.image, url: data.image } : undefined}
                initialVideo={data.video ? { id: data.video, url: getVideoUrl(data.video) } : undefined}
              />
              <div class="flex flex-col justify-end gap-4 pt-6 md:flex-row">
                <Button disabled={isSubmitting()} onClick={() => router.history.back()} type="button" variant="outline">
                  Annuler
                </Button>
                <form.AppForm>
                  <form.FormSubmit label="Modifier la recette" />
                </form.AppForm>
              </div>
            </Form>
          )
        }}
      </Show>
    </ScreenLayout>
  )
}

const paramsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.transform((str) => Number.parseInt(str, 10))
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

    return { id }
  },
})
