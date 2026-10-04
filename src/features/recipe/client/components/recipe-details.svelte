<script module lang="ts">
  import type { Snippet } from 'svelte'

  import type { Recipe } from '../api/get-one'
  import type { RecipeIngredientGroupsProps } from './recipe-section.svelte'
  import type { SubrecipeInstructions } from './steps/recipe-steps.svelte'

  interface RecipeDetailsContentProps {
    readonly recipe: Recipe
    readonly subrecipes: readonly SubrecipeInstructions[]
    readonly quantityControls: Snippet
    readonly renderIngredientGroups: Snippet<[RecipeIngredientGroupsProps]>
  }
</script>

<script lang="ts">
  import Badge from '@/components/ui/data-display/badge/badge.svelte'
  import Tabs from '@/components/ui/navigation/tabs/tabs.svelte'
  import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, VEGETARIAN_LABEL } from '@/features/recipe/constants'

  import RecipeStepGroups from './steps/recipe-steps.svelte'

  const { quantityControls, recipe, renderIngredientGroups, subrecipes }: RecipeDetailsContentProps = $props()
  const ingredientGroups = $derived([
    ...recipe.ingredientGroups,
    ...recipe.linkedRecipes.map(({ linkedRecipe }) => ({ ...linkedRecipe.ingredientGroups[0], groupName: linkedRecipe.name, isDefault: false })),
  ])
  const metaTags = $derived(
    [
      recipe.isVegetarian && VEGETARIAN_LABEL,
      recipe.isMagimix && MAGIMIX_LABEL,
      ...recipe.meals.map((meal) => MEAL_LABELS[meal]),
      ...recipe.cuisineTypes.map((cuisineType) => CUISINE_TYPE_LABELS[cuisineType]),
    ].filter((tag) => tag !== false)
  )
</script>

{#snippet ingredientsLabel()}Ingrédients{/snippet}
{#snippet preparationLabel()}Préparation{/snippet}
{#snippet ingredientsPanel()}
  <div class="recipe-details-ingredients-panel">
    {@render renderIngredientGroups({ baseServings: recipe.servings, ingredientGroups, presentation: 'standalone', recipeId: recipe.id })}
  </div>
{/snippet}
{#snippet preparationPanel()}
  <div class="recipe-details-instructions-panel"><RecipeStepGroups stepGroups={recipe.stepGroups} {subrecipes} /></div>
{/snippet}
<h1 class="recipe-details-heading">{recipe.name}</h1>
{#if metaTags.length > 0}<div class="recipe-details-metadata-tags">
    {#each metaTags as label (label)}<Badge size="sm" variant="secondary">{label}</Badge>{/each}
  </div>{/if}
<div class="recipe-details-quantity-controls">{@render quantityControls()}</div>
<div class="recipe-details-details-content">
  <div class="recipe-details-mobile-tabs">
    <Tabs
      items={[
        { content: ingredientsPanel, label: ingredientsLabel, value: 'ingredients' },
        { content: preparationPanel, label: preparationLabel, value: 'preparation' },
      ]}
    />
  </div>
  <div class="recipe-details-desktop-layout">
    <section class="recipe-details-section">
      <h2 class="recipe-details-ingredients-heading">Ingrédients</h2>
      {@render renderIngredientGroups({ baseServings: recipe.servings, ingredientGroups, presentation: 'embedded', recipeId: recipe.id })}
    </section>
    <section class="recipe-details-instructions-section">
      <h2 class="recipe-details-instructions-heading">Préparation</h2>
      <div class="recipe-details-instructions-content"><RecipeStepGroups stepGroups={recipe.stepGroups} {subrecipes} /></div>
    </section>
  </div>
</div>

<style>
  .recipe-details-ingredients-panel {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 16px;
    padding-inline: 8px;
  }

  .recipe-details-instructions-panel {
    height: 100%;
    overflow-y: auto;
    padding: 8px;
    padding-bottom: 16px;
  }

  .recipe-details-heading {
    display: none;
    font-family: var(--fonts-heading);
    font-size: var(--font-sizes-3xl);
    font-weight: var(--font-weights-bold);
    letter-spacing: var(--letter-spacings-tight);
    padding-block: 8px;
    padding-inline: 16px;
    text-wrap: balance;
  }

  @media screen and (min-width: 768px) {
    .recipe-details-heading {
      display: block;
    }
  }

  .recipe-details-metadata-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-inline: 4px;
    padding-top: 4px;
  }

  .recipe-details-quantity-controls {
    margin-block: 8px;
  }

  .recipe-details-details-content {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    min-height: 0px;
  }

  .recipe-details-mobile-tabs {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    margin-bottom: -16px;
    min-height: 0px;
  }

  @media screen and (min-width: 768px) {
    .recipe-details-mobile-tabs {
      display: none;
    }
  }

  .recipe-details-desktop-layout {
    align-items: stretch;
    display: none;
    gap: 32px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    padding-top: 16px;
  }

  @media screen and (min-width: 768px) {
    .recipe-details-desktop-layout {
      display: grid;
    }
  }

  .recipe-details-section {
    background: var(--colors-card);
    border-radius: var(--radius-3xl);
    box-shadow: var(--shadows-lg);
    grid-column: span 2 / span 2;
    padding-bottom: 32px;
    padding-inline: 32px;
  }

  .recipe-details-ingredients-heading {
    font-size: var(--font-sizes-xl);
    font-weight: var(--font-weights-bold);
    line-height: 28px;
    margin-bottom: 16px;
    margin-top: 32px;
  }

  .recipe-details-instructions-section {
    background: var(--colors-card);
    border-radius: var(--radius-3xl);
    box-shadow: var(--shadows-lg);
    grid-column: span 3 / span 3;
    padding-bottom: 32px;
    padding-inline: 32px;
  }

  .recipe-details-instructions-heading {
    font-size: var(--font-sizes-xl);
    font-weight: var(--font-weights-bold);
    line-height: 28px;
    margin-bottom: 16px;
    margin-top: 32px;
  }

  .recipe-details-instructions-content {
    padding-bottom: 16px;
  }
</style>
