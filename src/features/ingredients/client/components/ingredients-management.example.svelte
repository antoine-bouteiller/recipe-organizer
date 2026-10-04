<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import IngredientCatalogProvider from '@/features/ingredients/client/contexts/ingredient-catalog-provider.svelte'
  import type { Ingredient } from '@/types/ingredient'

  import IngredientsManagement from './ingredients-management.svelte'

  let isAdmin = $state(false)
  let ingredients: Ingredient[] = $state([
    { category: 'vegetables', countWeightG: null, densityGPerMl: null, id: 1, name: 'Tomate', parentId: null, preferredUnitSlug: null },
    { category: 'fish', countWeightG: null, densityGPerMl: null, id: 2, name: 'Saumon', parentId: null, preferredUnitSlug: null },
  ])
</script>

<Button onclick={() => (isAdmin = !isAdmin)}>Changer les permissions</Button>
<Button onclick={() => (ingredients = [])}>Vider le catalogue</Button>
<IngredientCatalogProvider {ingredients}><IngredientsManagement {isAdmin} /></IngredientCatalogProvider>
