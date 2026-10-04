<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'

  import SettingsContent from './settings-content.svelte'

  let isAdmin = $state(false)
</script>

<Button onclick={() => (isAdmin = !isAdmin)}>Changer les permissions</Button>
<SettingsContent {isAdmin} />
