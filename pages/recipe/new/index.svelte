<script lang="ts">
  import { useForm, useRouter } from '@void/svelte'

  import GoBackButton from '@/components/screen-layout/go-back-button.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import Button from '@/components/ui/actions/button/button.svelte'
  import FormSubmit from '@/components/ui/forms/form-submit/form-submit.svelte'
  import Form from '@/components/ui/forms/form/form.svelte'
  import { renderAddIngredientOption } from '@/features/ingredients/client/components/add-ingredient.svelte'
  import { provideIngredientCatalog } from '@/features/ingredients/client/contexts/ingredient-catalog-context.svelte'
  import { useIngredientOptions } from '@/features/ingredients/client/hooks/use-ingredient-options.svelte'
  import RecipeFormActions from '@/features/recipe/client/components/recipe-form-actions.svelte'
  import type { RecipeFormState } from '@/features/recipe/client/components/recipe-form.svelte'
  import RecipeForm from '@/features/recipe/client/components/recipe-form.svelte'
  import { provideRecipeCatalog } from '@/features/recipe/client/contexts/recipe-catalog-context.svelte'
  import { recipeDefaultValues } from '@/features/recipe/client/utils/form'
  import { alertError } from '@/lib/client/alert-error'
  import { useFormActionError } from '@/lib/client/page-action.svelte'

  import type { Props } from './index.server'

  const { ingredients, recipes }: Props = $props()
  provideIngredientCatalog(() => ingredients)
  provideRecipeCatalog(() => recipes)
  const ingredientOptions = useIngredientOptions()
  const router = useRouter()

  const form = useForm('/recipe/new', recipeDefaultValues)
  const errorMessage = () => `Erreur lors de la création de la recette ${form.data.name ?? ''}`
  useFormActionError(() => form.error, errorMessage)
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
      await form.post()
      if (form.wasSuccessful) {
        await router.visit('/', { replace: true })
      }
    } catch (error) {
      alertError(errorMessage(), error)
    }
  }
</script>

<ScreenLayout title="Nouvelle Recette">
  <Form errors={form.errors} onsubmit={submit}>
    <RecipeForm addNewIngredientOption={renderAddIngredientOption} form={recipeForm} ingredientOptions={ingredientOptions.current} />
    <RecipeFormActions>
      <Button disabled={form.pending} onclick={() => router.visit('/')} type="button" variant="outline">Annuler</Button>
      <FormSubmit pending={form.pending} label="Créer la recette" />
    </RecipeFormActions>
  </Form>
  {#snippet backButton()}<GoBackButton />{/snippet}
</ScreenLayout>
