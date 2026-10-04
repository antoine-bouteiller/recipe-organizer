<script lang="ts">
  import { useRouter } from '@void/svelte'
  import { onMount, tick } from 'svelte'

  import { ArrowElbowDownLeftIcon, MagnifyingGlassIcon } from '@/components/ui/data-display/icons'
  import Kbd from '@/components/ui/data-display/kbd/kbd.svelte'
  import ScrollArea from '@/components/ui/layout/scroll-area/scroll-area.svelte'
  import { loadRecipeList } from '@/features/recipe/client/api/get-all'
  import { alertError } from '@/lib/client/alert-error'
  import type { ReducedRecipe } from '@/types/recipe'
  import { normalize } from '@/utils/normalize'

  import * as styles from './search-bar.css'

  const { onClose }: { onClose: () => void } = $props()
  const router = useRouter()
  const listId = $props.id()
  let recipes = $state<ReducedRecipe[]>([])
  let pending = $state(true)
  let failed = $state(false)
  let query = $state('')
  let highlightedIndex = $state(0)
  let input: HTMLInputElement | undefined = undefined
  const normalizedQuery = $derived(normalize(query.trim()))
  const results = $derived(recipes.filter((recipe) => normalize(recipe.name).includes(normalizedQuery)))
  const highlighted = $derived(results.at(Math.min(highlightedIndex, results.length - 1)))
  const select = async (recipe: ReducedRecipe) => {
    onClose()
    try {
      await router.visit(`/recipe/${recipe.id}`)
    } catch (error) {
      alertError('Erreur lors de l’ouverture de la recette', error)
    }
  }
  onMount(() => {
    let active = true
    void tick().then(() => {
      if (active) {
        input?.focus()
      }
    })
    void loadRecipeList().then(
      (loaded) => {
        if (active) {
          recipes = loaded
          pending = false
        }
      },
      () => {
        if (active) {
          failed = true
          pending = false
        }
      }
    )
    return () => {
      active = false
    }
  })
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && highlighted) {
      event.preventDefault()
      void select(highlighted)
    } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && results.length > 0) {
      event.preventDefault()
      const current = results.indexOf(highlighted ?? results[0])
      highlightedIndex = (current + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length
    }
  }
  const revealHighlighted = (element: HTMLButtonElement) => {
    element.scrollIntoView({ block: 'nearest' })
  }
</script>

<div class={styles.palette}>
  <div class={styles.inputContainer}>
    <div class={styles.inputGroup} data-slot="autocomplete-input-group">
      <div aria-hidden="true" class={styles.addon} data-slot="autocomplete-start-addon"><MagnifyingGlassIcon /></div>
      <input
        aria-activedescendant={highlighted ? `${listId}-${highlighted.id}` : undefined}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded="true"
        aria-label="Rechercher une recette"
        bind:this={input}
        class={styles.input}
        data-slot="autocomplete-input"
        oninput={(event) => {
          query = event.currentTarget.value
          highlightedIndex = 0
        }}
        onkeydown={onKeyDown}
        placeholder="Rechercher une recette"
        role="combobox"
        value={query}
      />
    </div>
  </div>
  <div class={styles.panel} data-slot="command-panel">
    {#if pending}<div class={styles.empty} role="status">Chargement des recettes…</div>
    {:else if failed}<div class={styles.empty} role="alert">Impossible de charger les recettes. Fermez puis réessayez.</div>
    {:else if results.length === 0}<div class={styles.empty} data-slot="command-empty">Aucun résultats trouvé.</div>{/if}
    <ScrollArea scrollbarGutter="compact">
      <div class={styles.list} data-slot="command-list" id={listId} role="listbox">
        {#each results as recipe, index (recipe.id)}
          <button
            aria-selected={recipe === highlighted}
            class={styles.item}
            data-highlighted={recipe === highlighted || undefined}
            data-slot="command-item"
            id={`${listId}-${recipe.id}`}
            onclick={() => void select(recipe)}
            onmousedown={(event) => event.preventDefault()}
            onmousemove={() => (highlightedIndex = index)}
            role="option"
            tabindex="-1"
            type="button"
            {@attach recipe === highlighted ? revealHighlighted : undefined}>{recipe.name}</button
          >
        {/each}
      </div>
    </ScrollArea>
  </div>
  <div class={styles.footer} data-slot="command-footer">
    <div class={styles.footerShortcut}><Kbd><ArrowElbowDownLeftIcon /></Kbd><span>Open</span></div>
  </div>
</div>
