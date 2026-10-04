<script lang="ts">
  import type { ReducedRecipe } from '@/types/recipe'

  import QuantityControls from './quantity-controls.svelte'
  import RecipeListContent from './recipe-list.svelte'

  const { empty = false, canCreate = true }: { empty?: boolean; canCreate?: boolean } = $props()
  const recipes: ReducedRecipe[] = [
    {
      cuisineTypes: ['italian'],
      id: 92_001,
      image: '/magimix/expert.png',
      isMagimix: true,
      isSpice: false,
      isVegetarian: true,
      meals: ['diner'],
      name: 'Risotto',
      servings: 4,
    },
    {
      cuisineTypes: [],
      id: 92_002,
      image: '/magimix/expert.png',
      isMagimix: false,
      isSpice: true,
      isVegetarian: true,
      meals: [],
      name: 'Mélange d’épices',
      servings: 1,
    },
  ]
</script>

<RecipeListContent recipes={empty ? [] : recipes} {canCreate}>
  {#snippet renderCardAction(recipe)}<QuantityControls recipeId={recipe.id} servings={recipe.servings} variant="card" />{/snippet}
</RecipeListContent>
