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

<div class="search-bar-palette">
  <div class="search-bar-input-container">
    <div class="search-bar-input-group" data-slot="autocomplete-input-group">
      <div aria-hidden="true" class="search-bar-addon" data-slot="autocomplete-start-addon"><MagnifyingGlassIcon /></div>
      <input
        aria-activedescendant={highlighted ? `${listId}-${highlighted.id}` : undefined}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded="true"
        aria-label="Rechercher une recette"
        bind:this={input}
        class="search-bar-input"
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
  <div class="search-bar-panel" data-slot="command-panel">
    {#if pending}<div class="search-bar-empty" role="status">Chargement des recettes…</div>
    {:else if failed}<div class="search-bar-empty" role="alert">Impossible de charger les recettes. Fermez puis réessayez.</div>
    {:else if results.length === 0}<div class="search-bar-empty" data-slot="command-empty">Aucun résultats trouvé.</div>{/if}
    <ScrollArea scrollbarGutter="compact">
      <div class="search-bar-list" data-slot="command-list" id={listId} role="listbox">
        {#each results as recipe, index (recipe.id)}
          <button
            aria-selected={recipe === highlighted}
            class="search-bar-item"
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
  <div class="search-bar-footer" data-slot="command-footer">
    <div class="search-bar-footer-shortcut"><Kbd><ArrowElbowDownLeftIcon /></Kbd><span>Open</span></div>
  </div>
</div>

<style>
  .search-bar-palette {
    border-radius: inherit;
    display: flex;
    flex-direction: column;
    max-height: 420px;
    min-height: 0px;
    position: relative;
  }

  .search-bar-palette::before {
    background-color: color-mix(in srgb, var(--colors-muted) 72%, transparent);
    border-radius: inherit;
    content: '';
    inset: 0px;
    pointer-events: none;
    position: absolute;
  }

  .search-bar-input-container {
    padding-block: 6px;
    padding-inline: 10px;
  }

  .search-bar-input-group {
    background-color: transparent;
    border-radius: var(--radius-lg);
    color: var(--colors-foreground);
    position: relative;
    width: 100%;
  }

  .search-bar-input-group:has(:disabled) {
    opacity: 0.64;
  }

  .search-bar-addon {
    --owner-icon-size: 18px;
    --owner-icon-margin-inline: -2px;
    align-items: center;
    display: flex;
    inset-block: 0px;
    inset-inline-start: 1px;
    opacity: 0.8;
    padding-inline-start: 11px;
    pointer-events: none;
    position: absolute;
    z-index: 10;
  }

  @media screen and (min-width: 640px) {
    .search-bar-addon {
      --owner-icon-size: 16px;
    }
  }

  .search-bar-input {
    background-color: transparent;
    border-color: transparent;
    box-shadow: var(--shadows-none);
    color: var(--colors-foreground);
    font-size: var(--font-sizes-base);
    height: 38px;
    line-height: 38px;
    min-width: 0px;
    outline: 2px solid transparent;
    outline-offset: 2px;
    padding-inline-end: 12px;
    padding-inline-start: 33px;
    transition: background-color 5000000s ease-in-out 0s;
    width: 100%;
  }

  .search-bar-input::placeholder {
    color: color-mix(in srgb, var(--colors-muted-foreground) 72%, transparent);
  }

  @media screen and (min-width: 640px) {
    .search-bar-input {
      font-size: var(--font-sizes-sm);
      height: 34px;
      line-height: 34px;
      padding-inline-start: 31px;
    }
  }

  .search-bar-panel {
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
    background-color: var(--colors-popover);
    border-bottom-width: 0;
    border-top-left-radius: var(--radius-xl);
    border-top-right-radius: var(--radius-xl);
    border-width: 1px;
    box-shadow: var(--shadows-xs);
    clip-path: inset(0 1px);
    -webkit-clip-path: inset(0 1px);
    margin-inline: -1px;
    min-height: 0px;
    position: relative;
  }

  .search-bar-panel:not(:has(+ [data-slot='command-footer'])) {
    border-bottom-left-radius: var(--radius-2xl);
    border-bottom-right-radius: var(--radius-2xl);
    clip-path: inset(0 1px 1px 1px round 0 0 var(--radius-2xl) var(--radius-2xl));
    -webkit-clip-path: inset(0 1px 1px 1px round 0 0 var(--radius-2xl) var(--radius-2xl));
    margin-bottom: -1px;
  }

  .search-bar-panel::before {
    border-top-left-radius: var(--radius-xl);
    border-top-right-radius: var(--radius-xl);
    content: '';
    inset: 0px;
    pointer-events: none;
    position: absolute;
  }

  .search-bar-empty {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-base);
    text-align: center;
  }

  .search-bar-empty:not(:empty) {
    padding-block: 24px;
  }

  @media screen and (min-width: 640px) {
    .search-bar-empty {
      font-size: var(--font-sizes-sm);
    }
  }

  .search-bar-list:not(:empty) {
    padding: 8px;
    scroll-padding-block: 8px;
  }

  .search-bar-item {
    align-items: center;
    border-radius: var(--radius-sm);
    cursor: default;
    display: flex;
    font-size: var(--font-sizes-base);
    min-height: 32px;
    outline: 2px solid transparent;
    outline-offset: 2px;
    padding-block: 6px;
    padding-inline: 8px;
    -webkit-user-select: none;
    user-select: none;
  }

  .search-bar-item[data-highlighted] {
    background-color: var(--colors-accent);
    color: var(--colors-accent-foreground);
  }

  @media screen and (min-width: 640px) {
    .search-bar-item {
      font-size: var(--font-sizes-sm);
      min-height: 28px;
    }
  }

  .search-bar-footer {
    align-items: center;
    border-bottom-left-radius: var(--radius-2xl);
    border-bottom-right-radius: var(--radius-2xl);
    border-top-width: 1px;
    color: var(--colors-muted-foreground);
    display: flex;
    font-size: var(--font-sizes-xs);
    gap: 8px;
    justify-content: space-between;
    padding-block: 12px;
    padding-inline: 20px;
    position: relative;
  }

  .search-bar-footer-shortcut {
    align-items: center;
    color: var(--colors-foreground);
    display: flex;
    gap: 8px;
  }
</style>
