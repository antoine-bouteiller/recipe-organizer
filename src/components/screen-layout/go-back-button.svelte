<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { ArrowLeftIcon } from '@/components/ui/data-display/icons'
</script>

<Button aria-label="Retour" onclick={() => history.back()} size="icon" variant="ghost">
  <ArrowLeftIcon />
</Button>
