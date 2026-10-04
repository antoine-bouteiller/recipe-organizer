<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/components/ingredient-categories'
  import Button from '@/components/ui/actions/button/button.svelte'
  import Badge from '@/components/ui/data-display/badge/badge.svelte'
  import { PlusIcon } from '@/components/ui/data-display/icons/svelte'
  import ItemGroup from '@/components/ui/data-display/item/item-group.svelte'
  import ItemSeparator from '@/components/ui/data-display/item/item-separator.svelte'
  import Item from '@/components/ui/data-display/item/item.svelte'
  import SearchInput from '@/components/ui/forms/search-input/search-input.svelte'
  import type { IngredientCategory } from '@/features/ingredients/categories'
  import { useIngredientCatalog } from '@/features/ingredients/client/contexts/ingredient-catalog-context.svelte.ts'

  import AddIngredient from './add-ingredient.svelte'
  import DeleteIngredient from './delete-ingredient.svelte'
  import EditIngredient from './edit-ingredient.svelte'

  import * as styles from './ingredients-management.css'

  const { isAdmin }: { readonly isAdmin: boolean } = $props()
  const ingredients = useIngredientCatalog()
  let search = $state('')
  const query = $derived(search.trim().toLowerCase())
  const filteredIngredients = $derived(
    ingredients.current.filter((ingredient) => ingredient.name.toLowerCase().includes(query) || ingredient.category.toLowerCase().includes(query))
  )
  const categoryBadgeVariants = {
    fish: 'info-subtle',
    meat: 'destructive-subtle',
    other: 'neutral-subtle',
    spices: 'warning-subtle',
    vegetables: 'success-subtle',
  } as const satisfies Record<IngredientCategory, NonNullable<ComponentProps<typeof Badge>['variant']>>
</script>

<div class={styles.searchBar}>
  <SearchInput placeholder="Rechercher une recette, un ingrédient…" {search} setSearch={(next) => (search = next)} />
  <AddIngredient
    >{#snippet renderTrigger(props)}<Button {...props} aria-label="Ajouter un ingrédient" size="icon-lg" variant="outline"><PlusIcon /></Button
      >{/snippet}</AddIngredient
  >
</div>
{#if filteredIngredients.length === 0}
  <p class={styles.emptyState}>
    {search ? 'Aucun ingrédient trouvé pour cette recherche.' : 'Aucun ingrédient trouvé. Ajoutez-en un pour commencer.'}
  </p>
{:else}
  <ItemGroup>
    {#each filteredIngredients as ingredient, index (ingredient.id)}
      {@const Icon = ingredientCategoryIcons[ingredient.category]}
      {#snippet actions()}<EditIngredient {ingredient} /><DeleteIngredient ingredientId={ingredient.id} ingredientName={ingredient.name} />{/snippet}
      <Item layout="row" actions={isAdmin ? actions : undefined}>
        {#snippet title()}<span class={styles.ingredientName}>{ingredient.name}</span><span class={styles.categoryBadge}
            ><Badge variant={categoryBadgeVariants[ingredient.category]}
              ><Icon /><span class={styles.categoryLabel}>{ingredientCategoryLabels[ingredient.category]}</span></Badge
            ></span
          >{/snippet}
      </Item>
      {#if index !== filteredIngredients.length - 1}<ItemSeparator />{/if}
    {/each}
  </ItemGroup>
{/if}
