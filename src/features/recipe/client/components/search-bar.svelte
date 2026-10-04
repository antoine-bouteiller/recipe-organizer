<script lang="ts">
  import { onMount } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'
  import KbdGroup from '@/components/ui/data-display/kbd/kbd-group.svelte'
  import Kbd from '@/components/ui/data-display/kbd/kbd.svelte'
  import Dialog from '@/components/ui/overlays/dialog/dialog.svelte'
  import { usePlatform } from '@/hooks/use-platform.svelte'

  import SearchPalette from './search-palette.private.svelte'

  import * as styles from './search-bar.css'

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

<div class={styles.container}>
  <Dialog bare onOpenChange={(next) => (open = next)} {open} title="Rechercher une recette">
    {#snippet renderTrigger(props)}<Button {...props} align="start" variant="outline" width="full">
        Recherche une recette...
        <span class={styles.text}
          ><KbdGroup><Kbd>{platform.current === 'macOS' ? '⌘' : 'Ctrl'}</Kbd><span class={styles.shortcutKey}><Kbd>K</Kbd></span></KbdGroup></span
        >
      </Button>{/snippet}
    <SearchPalette onClose={() => (open = false)} />
  </Dialog>
</div>
