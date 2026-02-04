import type { type } from 'arktype'

import { revalidateLogic, useStore } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { createRecipeOptions, recipeSchema } from '@/features/recipe/api/create'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { RecipeForm } from '@/features/recipe/components/recipe-form'
import { recipeDefaultValues, recipeFormFields } from '@/features/recipe/utils/constants'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { useAppForm } from '@/hooks/use-app-form'
import { objectToFormData } from '@/utils/form-data'
import { formatFormErrors } from '@/utils/format-form-errors'

const NewRecipePending = () => (
  <ScreenLayout title="Nouvelle Recette" withGoBack>
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

const NewRecipePage = () => {
  const router = useRouter()
  const { mutateAsync: createRecipe } = useMutation(createRecipeOptions())

  const form = useAppForm({
    defaultValues: recipeDefaultValues,
    onSubmit: async ({ value }) => {
      const formData = objectToFormData(value)
      await createRecipe({ data: formData })

      await router.navigate({ to: '/' })
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: recipeSchema,
    },
  })

  const errors = useStore(form.store, (state) => formatFormErrors(state.errors as unknown as Record<string, type.errors>[]))

  return (
    <ScreenLayout title="Nouvelle Recette" withGoBack>
      <Form
        className="p-4"
        errors={errors}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <RecipeForm fields={recipeFormFields} form={form} />
        <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row">
          <Button disabled={form.state.isSubmitting} onClick={() => router.navigate({ to: '/' })} type="button" variant="outline">
            Annuler
          </Button>
          <form.AppForm>
            <form.FormSubmit label="Créer la recette" />
          </form.AppForm>
        </div>
      </Form>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/recipe/new')({
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ from: '/recipe/new', to: '/auth/login' })
    }
  },
  component: NewRecipePage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getIngredientListOptions())
    await context.queryClient.ensureQueryData(getRecipeListOptions())
    await context.queryClient.ensureQueryData(getUnitsListOptions())
  },
  pendingComponent: NewRecipePending,
})
