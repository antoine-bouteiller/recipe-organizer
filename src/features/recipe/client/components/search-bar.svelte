<script lang="ts">
  import { onMount } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'
  import KbdGroup from '@/components/ui/data-display/kbd/kbd-group.svelte'
  import Kbd from '@/components/ui/data-display/kbd/kbd.svelte'
  import Dialog from '@/components/ui/overlays/dialog/dialog.svelte'
  import { usePlatform } from '@/hooks/use-platform.svelte'

  import SearchPalette from './search-palette.private.svelte'

  let open = $state(false)
  const platform = usePlatform()
  const down = (event: KeyboardEvent) => {
    if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      open = !open
    }
  }
  onMount(() => {
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  })
</script>

<div class="search-bar-container">
  <Dialog bare onOpenChange={(next) => (open = next)} {open} title="Rechercher une recette">
    {#snippet renderTrigger(props)}<Button {...props} align="start" variant="outline" width="full">
        Recherche une recette...
        <span class="search-bar-text"
          ><KbdGroup><Kbd>{platform.current === 'macOS' ? '⌘' : 'Ctrl'}</Kbd><span class="search-bar-shortcut-key"><Kbd>K</Kbd></span></KbdGroup
          ></span
        >
      </Button>{/snippet}
    <SearchPalette onClose={() => (open = false)} />
  </Dialog>
</div>

<style>
  .search-bar-container {
    width: 224px;
  }

  .search-bar-text {
    display: flex;
    position: absolute;
    right: 6px;
    top: 50%;
    translate: 0 -50%;
  }

  .search-bar-shortcut-key {
    aspect-ratio: 1 / 1;
  }
</style>
