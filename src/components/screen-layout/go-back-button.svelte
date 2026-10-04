<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { ArrowLeftIcon } from '@/components/ui/data-display/icons'

  const { onBack = () => history.back() }: { onBack?: () => void } = $props()
</script>

<Button aria-label="Retour" onclick={onBack} size="icon" variant="ghost">
  <ArrowLeftIcon />
</Button>
