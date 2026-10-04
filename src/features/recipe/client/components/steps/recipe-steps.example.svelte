<script lang="ts">
  import type { RecipeStepGroup } from '@/features/recipe/schemas'

  import RecipeStepGroups from './recipe-steps.svelte'

  const stepGroups: RecipeStepGroup[] = [
    {
      kind: 'steps',
      steps: [
        { magimix: { program: 'expert', rotationSpeed: 'auto', temperature: 100, time: 90 }, text: 'Mélanger **vivement**. <b>reste littéral</b>' },
      ],
    },
    { kind: 'subrecipe', recipeId: 11 },
    { kind: 'subrecipe', recipeId: 12 },
  ]
  let steps = $state([{ text: 'Couper les tomates' }, { text: 'Chauffer' }, { text: 'Servir' }])
  const subrecipes = $derived([{ id: 11, name: 'Sauce tomate', steps }])
</script>

<button
  type="button"
  onclick={() => {
    steps = [...steps, { text: 'Poivrer' }]
  }}>Actualiser les instructions</button
>
<RecipeStepGroups {stepGroups} {subrecipes} />
