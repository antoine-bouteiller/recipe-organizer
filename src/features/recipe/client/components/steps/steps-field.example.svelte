<script lang="ts">
  import Form from '@/components/ui/forms/form/form.svelte'
  import LinkedRecipesProvider from '@/features/recipe/client/contexts/linked-recipes-provider.svelte'
  import RecipeCatalogProvider from '@/features/recipe/client/contexts/recipe-catalog-provider.svelte'
  import type { RecipeFormInput } from '@/features/recipe/schemas'

  import type { RecipeFormState } from '../recipe-form-state.svelte'
  import StepsField from './steps-field.svelte'

  let data = $state<RecipeFormInput>({ stepGroups: [{ _key: 'default', kind: 'steps', steps: [] }] })
  let linkedRecipeIds = $state([11])
  let name = $state('Sauce tomate')
  const form: RecipeFormState = {
    get data() {
      return data
    },
    pending: false,
    setData: (key, value) => {
      data = { ...data, [key]: value }
    },
  }
  const recipes = $derived([
    { cuisineTypes: [], id: 11, image: '', isMagimix: false, isSpice: false, isVegetarian: true, meals: [], name, servings: 4 },
  ])
</script>

<button
  type="button"
  onclick={() => {
    name = 'Sauce rafraîchie'
  }}>Rafraîchir le catalogue</button
>
<button
  type="button"
  onclick={() => {
    linkedRecipeIds = []
  }}>Retirer le lien</button
>
<RecipeCatalogProvider {recipes}>
  <LinkedRecipesProvider {linkedRecipeIds}>
    <Form errors={{ 'stepGroups.1.recipeId': 'Choisissez une sous-recette liée' }} onsubmit={(event) => event.preventDefault()}>
      <StepsField disabled={false} {form} />
      <output aria-label="Étapes enregistrées">{JSON.stringify(data.stepGroups)}</output>
    </Form>
  </LinkedRecipesProvider>
</RecipeCatalogProvider>
