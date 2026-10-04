<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import FormErrors from '@/components/ui/forms/form/form-errors.svelte'
  import IngredientCatalogProvider from '@/features/ingredients/client/contexts/ingredient-catalog-provider.svelte'
  import type { IngredientFormInput } from '@/features/ingredients/schemas'
  import type { Ingredient } from '@/types/ingredient'

  import IngredientForm, { getIngredientDefaultValues } from './ingredient-form.svelte'

  let ingredients: Ingredient[] = $state([
    { category: 'vegetables', countWeightG: null, densityGPerMl: null, id: 1, name: 'Tomate', parentId: null, preferredUnitSlug: null },
  ])
  let data = $state(getIngredientDefaultValues('Sauce tomate'))
  let errors = $state<Record<string, string>>({})
  const setData = <TKey extends keyof IngredientFormInput>(key: TKey, value: IngredientFormInput[TKey]) => {
    data[key] = value
  }
</script>

<Button onclick={() => (ingredients = [{ ...ingredients[0], id: 2, name: 'Courgette' }])}>Actualiser le catalogue</Button>
<Button onclick={() => (errors = { name: 'Le nom doit comporter au moins 2 caractères' })}>Afficher une erreur</Button>
<IngredientCatalogProvider {ingredients}>
  <FormErrors {errors}><IngredientForm {data} {setData} pending={false} /></FormErrors>
</IngredientCatalogProvider>
