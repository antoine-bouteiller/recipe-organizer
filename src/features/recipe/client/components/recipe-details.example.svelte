<script lang="ts">
  import type { Recipe } from '../api/get-one'
  import QuantityControls from './quantity-controls.svelte'
  import RecipeDetailsContent from './recipe-details.svelte'
  import RecipeIngredientGroups from './recipe-section.svelte'

  const { duplicateLinked = false }: { duplicateLinked?: boolean } = $props()
  let id = $state(93_001)
  const recipe = $derived({
    cuisineTypes: ['french'],
    id,
    image: '/magimix/expert.png',
    ingredientGroups: [
      { groupIngredients: [{ id: 1, ingredient: { id: 1, name: 'Farine' }, quantity: 100, unitSlug: 'g' }], groupName: null, id: 1 },
    ],
    isMagimix: true,
    isVegetarian: true,
    linkedRecipes: [
      {
        linkedRecipe: {
          id: 11,
          ingredientGroups: [
            { groupIngredients: [{ id: 2, ingredient: { id: 2, name: 'Tomate' }, quantity: 2, unitSlug: null }], groupName: null, id: 2 },
          ],
          name: 'Sauce tomate',
        },
        linkedRecipeId: 11,
        ratio: 0.5,
        recipeId: id,
      },
    ],
    meals: ['diner'],
    name: id === 93_001 ? 'Gâteau' : 'Autre gâteau',
    servings: id === 93_001 ? 4 : 2,
    stepGroups: [
      {
        kind: 'steps',
        steps: [{ magimix: { program: 'expert', rotationSpeed: 'auto', temperature: 100, time: 125 }, text: 'Mélanger **vivement**.' }],
      },
      { kind: 'subrecipe', recipeId: 11 },
    ],
    video: null,
  } satisfies Recipe)
  const subrecipes = [{ id: 11, name: 'Sauce tomate', steps: [{ text: 'Cuire les tomates' }] }]
</script>

<button
  type="button"
  onclick={() => {
    id = id === 93001 ? 93002 : 93001
  }}>Changer de recette</button
>
<RecipeDetailsContent
  recipe={duplicateLinked ? { ...recipe, linkedRecipes: [...recipe.linkedRecipes, ...recipe.linkedRecipes] } : recipe}
  {subrecipes}
>
  {#snippet quantityControls()}<QuantityControls recipeId={recipe.id} servings={recipe.servings} />{/snippet}
  {#snippet renderIngredientGroups(props)}<RecipeIngredientGroups {...props} />{/snippet}
</RecipeDetailsContent>
