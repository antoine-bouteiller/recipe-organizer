<script module lang="ts">
  import type { Snippet } from 'svelte'

  import type { ReducedRecipe } from '@/types/recipe'

  export interface RecipeListContentProps {
    readonly canCreate: boolean
    readonly recipes: readonly ReducedRecipe[]
    readonly renderCardAction: Snippet<[ReducedRecipe]>
  }
</script>

<script lang="ts">
  import { Link } from '@void/svelte'

  import Button from '@/components/ui/actions/button/button.svelte'
  import Badge from '@/components/ui/data-display/badge/badge.svelte'
  import { BookIcon, PlusIcon } from '@/components/ui/data-display/icons/svelte'
  import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@/features/recipe/constants'

  import * as cardStyles from './recipe-card.css'
  import * as styles from './recipe-list.css'

  const { canCreate, recipes, renderCardAction }: RecipeListContentProps = $props()
  const visibleRecipes = $derived(recipes.filter((recipe) => !recipe.isSpice))
  const recipePrefetch = ['visible', 'hover'] as const
</script>

{#if visibleRecipes.length === 0}
  <div class={styles.emptyState}>
    <div class={styles.emptyStateIcon}><BookIcon size="xl" /></div>
    <p class={styles.text}>Aucune recette</p>
    {#if canCreate}<Button asLink href="/recipe/new"><PlusIcon size="sm" />Ajouter une recette</Button>{/if}
  </div>
{:else}
  <div class={styles.recipeGrid}>
    {#each visibleRecipes as recipe, index (recipe.id)}
      <article class={cardStyles.card}>
        <img alt={recipe.name} class={cardStyles.image} decoding="async" loading={index < 6 ? 'eager' : 'lazy'} src={recipe.image} />
        <Link class={cardStyles.recipeLink} href={`/recipe/${recipe.id}`} prefetch={recipePrefetch}>
          <div class={cardStyles.tags}>
            {#if recipe.isVegetarian}<Badge size="sm" variant="secondary">{VEGETARIAN_LABEL}</Badge>{/if}
            {#if recipe.isMagimix}<Badge size="sm" variant="secondary">{MAGIMIX_LABEL}</Badge>{/if}
            {#if recipe.isSpice}<Badge size="sm" variant="secondary">{SPICE_LABEL}</Badge>{/if}
            {#each recipe.meals as meal (meal)}<Badge size="sm" variant="secondary">{MEAL_LABELS[meal]}</Badge>{/each}
            {#each recipe.cuisineTypes as cuisineType (cuisineType)}<Badge size="sm" variant="secondary">{CUISINE_TYPE_LABELS[cuisineType]}</Badge
              >{/each}
          </div>
          <h2 class={cardStyles.heading}>{recipe.name}</h2>
        </Link>
        {@render renderCardAction(recipe)}
      </article>
    {/each}
  </div>
{/if}
{#if canCreate}<div class={styles.floatingAction}>
    <Button aria-label="Ajouter une recette" asLink href="/recipe/new" size="icon-xl"><PlusIcon size="xl" /></Button>
  </div>{/if}
