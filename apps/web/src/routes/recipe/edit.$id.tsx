import { NotFound } from '@client/components/error/not-found'
import { ScreenLayout } from '@client/components/layout/screen-layout'
import { getIngredientListOptions } from '@client/features/ingredients/api/get-all'
import { renderAddIngredientOption } from '@client/features/ingredients/components/add-ingredient'
import { useIngredientOptions } from '@client/features/ingredients/hooks/use-ingredient-options'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { getRecipeDetailsOptions, type RecipeIngredientGroup } from '@client/features/recipe/api/get-one'
import { updateRecipeOptions, updateRecipeSchema, type UpdateRecipeFormInput } from '@client/features/recipe/api/update'
import { RecipeForm } from '@client/features/recipe/components/recipe-form'
import { recipeFormFields } from '@client/features/recipe/utils/form'
import { Button } from '@recipe-organizer/design-system/button'
import { Form } from '@recipe-organizer/design-system/form'
import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { Spinner } from '@recipe-organizer/design-system/spinner'
import { formatFormErrors } from '@recipe-organizer/design-system/utils/format-form-errors'
import { objectToFormData } from '@recipe-organizer/shared/utils/form-data'
import { getVideoUrl } from '@recipe-organizer/shared/utils/get-file-url'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useSelector } from '@tanstack/react-store'
import * as z from 'zod'

import * as styles from './-edit.$id.css'

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

const EditRecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe, isLoading } = useSuspenseQuery(getRecipeDetailsOptions(id))
  const { mutateAsync: updateRecipe } = useMutation(updateRecipeOptions())
  const router = useRouter()
  const ingredientOptions = useIngredientOptions()

  const initialValues: UpdateRecipeFormInput = recipe
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

  const errors = useSelector(form.store, (state) => formatFormErrors(state.errors))

  if (isLoading) {
    return (
      <div className={styles.container}>
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
        errors={errors}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <RecipeForm
          addNewIngredientOption={renderAddIngredientOption}
          fields={recipeFormFields}
          form={form}
          id={recipe.id}
          ingredientOptions={ingredientOptions}
          initialImage={{ id: recipe.image, url: recipe.image }}
          initialVideo={recipe.video ? { id: recipe.video, url: getVideoUrl(recipe.video) } : undefined}
        />
        <div className={styles.container2}>
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
      throw new Error(result.error.issues[0]?.message ?? 'Invalid id')
    }
    const { id } = result.data
    await context.queryClient.query({ ...getRecipeDetailsOptions(id), staleTime: 'static' })
    await context.queryClient.query({ ...getIngredientListOptions(), staleTime: 'static' })
    await context.queryClient.query({ ...getRecipeListOptions(), staleTime: 'static' })

    return { id }
  },
})
