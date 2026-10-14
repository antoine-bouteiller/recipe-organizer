<script lang="ts">
  import { createMutation, createQuery } from '@tanstack/svelte-query'

  import GoBackButton from '@/components/screen-layout/go-back-button.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import Button from '@/components/ui/actions/button/button.svelte'
  import FormSubmit from '@/components/ui/forms/form-submit/form-submit.svelte'
  import Form from '@/components/ui/forms/form/form.svelte'
  import { ingredientListQuery } from '@/features/ingredients/client/api/get-all'
  import { renderAddIngredientOption } from '@/features/ingredients/client/components/add-ingredient.svelte'
  import { provideIngredientCatalog } from '@/features/ingredients/client/contexts/ingredient-catalog-context.svelte'
  import { useIngredientOptions } from '@/features/ingredients/client/hooks/use-ingredient-options.svelte'
  import { createRecipeMutation } from '@/features/recipe/client/api/create'
  import { recipeListQuery } from '@/features/recipe/client/api/get-all'
  import RecipeFormActions from '@/features/recipe/client/components/recipe-form-actions.svelte'
  import type { RecipeFormState } from '@/features/recipe/client/components/recipe-form.svelte'
  import RecipeForm from '@/features/recipe/client/components/recipe-form.svelte'
  import { provideRecipeCatalog } from '@/features/recipe/client/contexts/recipe-catalog-context.svelte'
  import { recipeDefaultValues } from '@/features/recipe/client/utils/form'
  import { alertError } from '@/lib/client/alert-error'
  import { createForm } from '@/lib/client/form.svelte'
  import { router } from '@/lib/client/router/router.svelte'

  const ingredients = createQuery(() => ingredientListQuery())
  const recipes = createQuery(() => recipeListQuery())
  provideIngredientCatalog(() => ingredients.data ?? [])
  provideRecipeCatalog(() => recipes.data ?? [])
  const ingredientOptions = useIngredientOptions()
  const mutation = createMutation(() => createRecipeMutation())

  const form = createForm(recipeDefaultValues)
  const recipeForm: RecipeFormState = {
    get data() {
      return form.data
    },
    get pending() {
      return form.pending
    },
    setData: (key, value) => {
      form.data[key] = value
    },
  }

  const submit = async (event: SubmitEvent) => {
    event.preventDefault()
    if (form.pending) {
      return
    }
    try {
      if (await form.submit((body) => mutation.mutateAsync(body))) {
        await router.navigate('/', { replace: true })
      }
    } catch (error) {
      alertError(`Erreur lors de la création de la recette ${form.data.name ?? ''}`, error)
    }
  }
</script>

<ScreenLayout title="Nouvelle Recette">
  <Form errors={form.errors} onsubmit={submit}>
    <RecipeForm addNewIngredientOption={renderAddIngredientOption} form={recipeForm} ingredientOptions={ingredientOptions.current} />
    <RecipeFormActions>
      <Button disabled={form.pending} onclick={() => router.navigate('/')} type="button" variant="outline">Annuler</Button>
      <FormSubmit pending={form.pending} label="Créer la recette" />
    </RecipeFormActions>
  </Form>
  {#snippet backButton()}<GoBackButton />{/snippet}
</ScreenLayout>
