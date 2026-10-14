<script lang="ts">
  import { json, stubFetch } from '@storybook-helpers/stub-fetch'

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
  stubFetch(async (request) => {
    const data: Omit<Ingredient, 'id'> = await request.json()
    if (data.name.length < 2) {
      return json({ error: 'Invalid Schema', errors: { name: 'Le nom doit comporter au moins 2 caractères' } }, 400)
    }
    ingredient = { ...data, id: ingredient.id, parentId: data.parentId ?? null }
    return new Response(null, { status: 204 })
  })
</script>

<Button onclick={() => (ingredient = { ...ingredient, name: 'Courgette' })}>Actualiser l'ingrédient</Button>
<p role="status">Ingrédient: {ingredient.name}</p>
<IngredientCatalogProvider ingredients={[ingredient]}><EditIngredient {ingredient} /></IngredientCatalogProvider>
