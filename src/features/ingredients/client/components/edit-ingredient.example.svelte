<script lang="ts">
  import { setContext } from 'svelte'
  import { createSsrRouter } from 'void/pages-client'
  import type { VoidRouter } from 'void/pages-client'

  import Button from '@/components/ui/actions/button/button.svelte'
  import IngredientCatalogProvider from '@/features/ingredients/client/contexts/ingredient-catalog-provider.svelte'
  import type { Ingredient } from '@/types/ingredient'

  import EditIngredient from './edit-ingredient.svelte'

  let ingredient: Ingredient = $state({
    category: 'vegetables',
    countWeightG: null,
    densityGPerMl: null,
    id: 1,
    name: 'Tomate',
    parentId: null,
    preferredUnitSlug: null,
  })
  const router: VoidRouter = {
    ...createSsrRouter('/settings/ingredients'),
    visit: async (_url, options) => {
      const data = options?.data as Ingredient
      if (data.name.length < 2) {
        return { errors: { name: 'Le nom doit comporter au moins 2 caractères' } }
      }
      ingredient = { ...data, parentId: data.parentId ?? null }
      return {}
    },
  }
  setContext('__void_router', router)
</script>

<Button onclick={() => (ingredient = { ...ingredient, name: 'Courgette' })}>Actualiser l'ingrédient</Button>
<p role="status">Ingrédient: {ingredient.name}</p>
<IngredientCatalogProvider ingredients={[ingredient]}><EditIngredient {ingredient} /></IngredientCatalogProvider>
