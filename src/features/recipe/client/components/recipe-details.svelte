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

  import * as styles from './recipe-details.css'

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
  <div class={styles.ingredientsPanel}>
    {@render renderIngredientGroups({ baseServings: recipe.servings, ingredientGroups, presentation: 'standalone', recipeId: recipe.id })}
  </div>
{/snippet}
{#snippet preparationPanel()}
  <div class={styles.instructionsPanel}><RecipeStepGroups stepGroups={recipe.stepGroups} {subrecipes} /></div>
{/snippet}
<h1 class={styles.heading}>{recipe.name}</h1>
{#if metaTags.length > 0}<div class={styles.metadataTags}>
    {#each metaTags as label (label)}<Badge size="sm" variant="secondary">{label}</Badge>{/each}
  </div>{/if}
<div class={styles.quantityControls}>{@render quantityControls()}</div>
<div class={styles.detailsContent}>
  <div class={styles.mobileTabs}>
    <Tabs
      items={[
        { content: ingredientsPanel, label: ingredientsLabel, value: 'ingredients' },
        { content: preparationPanel, label: preparationLabel, value: 'preparation' },
      ]}
    />
  </div>
  <div class={styles.desktopLayout}>
    <section class={styles.section}>
      <h2 class={styles.ingredientsHeading}>Ingrédients</h2>
      {@render renderIngredientGroups({ baseServings: recipe.servings, ingredientGroups, presentation: 'embedded', recipeId: recipe.id })}
    </section>
    <section class={styles.instructionsSection}>
      <h2 class={styles.instructionsHeading}>Préparation</h2>
      <div class={styles.instructionsContent}><RecipeStepGroups stepGroups={recipe.stepGroups} {subrecipes} /></div>
    </section>
  </div>
</div>
