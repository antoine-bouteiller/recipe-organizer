<script lang="ts">
  import { json, stubFetch } from '@storybook-helpers/stub-fetch'

  import Button from '@/components/ui/actions/button/button.svelte'

  import ApproveUser from './approve-user.svelte'
  import BlockUser from './block-user.svelte'

  const { blocked, failure }: { blocked?: boolean; failure?: boolean } = $props()
  let requests = $state(0)
  let complete: (() => void) | undefined = $state()
  stubFetch(async () => {
    requests += 1
    await new Promise<void>((resolve) => {
      complete = resolve
    })
    complete = undefined
    return failure ? json({ error: 'Service indisponible' }, 500) : new Response(null, { status: 204 })
  })
</script>

<Button onclick={() => complete?.()}>Terminer l'action</Button>
<p role="status">Actions: {requests}</p>
{#if blocked}<BlockUser userEmail="alice@example.com" userId="alice" />{:else}<ApproveUser userId="alice" />{/if}
