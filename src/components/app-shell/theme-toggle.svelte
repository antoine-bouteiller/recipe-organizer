<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { ThemeIcon } from '@/components/ui/data-display/icons/svelte'
  import { toggleTheme } from '@/lib/client/theme'
</script>

<Button aria-label="Changer de thème" onclick={toggleTheme} size="icon" variant="ghost">
  <ThemeIcon size="lg" />
</Button>
