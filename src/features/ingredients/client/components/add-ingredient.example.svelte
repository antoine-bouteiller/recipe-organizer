<script lang="ts">
  import { trackInvalidations } from '@storybook-helpers/stub-fetch'
  import { useQueryClient } from '@tanstack/svelte-query'

  import Button from '@/components/ui/actions/button/button.svelte'
  import IngredientCatalogProvider from '@/features/ingredients/client/contexts/ingredient-catalog-provider.svelte'
  import type { Ingredient } from '@/types/ingredient'

  import AddIngredient from './add-ingredient.svelte'

  let refreshes = $state(0)
  let ingredients: Ingredient[] = $state([])
  trackInvalidations(useQueryClient(), 'ingredients', () => {
    refreshes += 1
    ingredients = [
      { category: 'vegetables', countWeightG: null, densityGPerMl: null, id: 2, name: 'Courgette', parentId: null, preferredUnitSlug: null },
    ]
  })
</script>

<p role="status">Actualisations: {refreshes}</p>
<IngredientCatalogProvider {ingredients}>
  <AddIngredient defaultValue="Tomate">
    {#snippet renderTrigger(props)}<Button {...props}>Ajouter un ingrédient</Button>{/snippet}
  </AddIngredient>
</IngredientCatalogProvider>
