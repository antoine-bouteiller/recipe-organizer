<script module lang="ts">
  import type { Snippet } from 'svelte'

  import type { ReducedRecipe } from '@/types/recipe'

  interface RecipeListContentProps {
    readonly canCreate: boolean
    readonly recipes: readonly ReducedRecipe[]
    readonly renderCardAction: Snippet<[ReducedRecipe]>
  }
</script>

<script lang="ts">
  import { Link } from '@void/svelte'

  import Button from '@/components/ui/actions/button/button.svelte'
  import Badge from '@/components/ui/data-display/badge/badge.svelte'
  import { BookIcon, PlusIcon } from '@/components/ui/data-display/icons'
  import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@/features/recipe/constants'

  const { canCreate, recipes, renderCardAction }: RecipeListContentProps = $props()
  const visibleRecipes = $derived(recipes.filter((recipe) => !recipe.isSpice))
  const recipePrefetch = ['visible', 'hover'] as const
</script>

{#if visibleRecipes.length === 0}
  <div class="recipe-list-empty-state">
    <div class="recipe-list-empty-state-icon"><BookIcon size="xl" /></div>
    <p class="recipe-list-text">Aucune recette</p>
    {#if canCreate}<Button asLink href="/recipe/new"><PlusIcon size="sm" />Ajouter une recette</Button>{/if}
  </div>
{:else}
  <div class="recipe-list-recipe-grid">
    {#each visibleRecipes as recipe, index (recipe.id)}
      <article class="recipe-card-card">
        <img alt={recipe.name} class="recipe-card-image" decoding="async" loading={index < 6 ? 'eager' : 'lazy'} src={recipe.image} />
        <Link class="recipe-card-recipe-link" href={`/recipe/${recipe.id}`} prefetch={recipePrefetch}>
          <div class="recipe-card-tags">
            {#if recipe.isVegetarian}<Badge size="sm" variant="secondary">{VEGETARIAN_LABEL}</Badge>{/if}
            {#if recipe.isMagimix}<Badge size="sm" variant="secondary">{MAGIMIX_LABEL}</Badge>{/if}
            {#if recipe.isSpice}<Badge size="sm" variant="secondary">{SPICE_LABEL}</Badge>{/if}
            {#each recipe.meals as meal (meal)}<Badge size="sm" variant="secondary">{MEAL_LABELS[meal]}</Badge>{/each}
            {#each recipe.cuisineTypes as cuisineType (cuisineType)}<Badge size="sm" variant="secondary">{CUISINE_TYPE_LABELS[cuisineType]}</Badge
              >{/each}
          </div>
          <h2 class="recipe-card-heading">{recipe.name}</h2>
        </Link>
        {@render renderCardAction(recipe)}
      </article>
    {/each}
  </div>
{/if}
{#if canCreate}<div class="recipe-list-floating-action">
    <Button aria-label="Ajouter une recette" asLink href="/recipe/new" size="icon-xl"><PlusIcon size="xl" /></Button>
  </div>{/if}

<style>
  .recipe-card-card {
    border-radius: var(--radius-4xl);
    @supports (corner-shape: squircle) {
      corner-shape: squircle;
    }
    background: #1b2426;
    box-shadow: var(--shadows-lg);
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 240px;
    isolation: isolate;
    overflow: hidden;
    padding: 18px;
    position: relative;
    --shadow-color: color-mix(in srgb, var(--colors-primary) 10%, transparent);
    --transition-duration: 200ms;
    --transition-prop: transform;
    --transition-easing: ease-out;
    transition-duration: 200ms;
    transition-property: transform;
    transition-timing-function: ease-out;
  }

  .recipe-card-card:hover {
    transform: translateY(-2px);
  }

  .recipe-card-card:active {
    transform: scale(0.99);
  }

  .recipe-card-card::before {
    border-radius: var(--radius-4xl);
    @supports (corner-shape: squircle) {
      corner-shape: squircle;
    }
    background: linear-gradient(to top, rgba(8, 14, 14, 0.93) 0%, rgba(8, 14, 14, 0.34) 54%, rgba(8, 14, 14, 0) 78%);
    content: '';
    inset: 0px;
    pointer-events: none;
    position: absolute;
    z-index: -1;
  }

  .recipe-card-image {
    border-radius: var(--radius-4xl);
    @supports (corner-shape: squircle) {
      corner-shape: squircle;
    }
    height: 100%;
    inset: 0px;
    object-fit: cover;
    position: absolute;
    width: 100%;
    z-index: -2;
  }

  :where(.recipe-card-card) :global(.recipe-card-recipe-link) {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 8px;
    justify-content: flex-end;
    margin: -18px -18px 0px;
    min-height: 0px;
    outline-offset: -2px;
    padding: 18px 18px 0px;
  }

  .recipe-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .recipe-card-heading {
    color: var(--colors-inverse-foreground);
    font-family: var(--fonts-heading);
    font-size: var(--font-sizes-xl);
    font-weight: var(--font-weights-normal);
    line-height: var(--line-heights-tight);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .recipe-list-empty-state {
    align-items: center;
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    padding: 32px;
    text-align: center;
  }

  .recipe-list-empty-state-icon {
    align-items: center;
    background: var(--colors-accent);
    border-radius: var(--radius-full);
    color: var(--colors-primary);
    display: flex;
    height: 64px;
    justify-content: center;
    width: 64px;
  }

  .recipe-list-text {
    color: var(--colors-muted-foreground);
    text-wrap: balance;
  }

  .recipe-list-recipe-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  @media screen and (min-width: 640px) {
    .recipe-list-recipe-grid {
      gap: 24px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media screen and (min-width: 1024px) {
    .recipe-list-recipe-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .recipe-list-floating-action {
    bottom: 64px;
    position: fixed;
    right: 8px;
  }

  @media screen and (min-width: 768px) {
    .recipe-list-floating-action {
      display: none;
    }
  }
</style>
