<script lang="ts">
  import { setContext } from 'svelte'
  import { createSsrRouter, VoidActionError } from 'void/pages-client'
  import type { VoidRouter } from 'void/pages-client'

  import Button from '@/components/ui/actions/button/button.svelte'

  import ApproveUser from './approve-user.svelte'
  import BlockUser from './block-user.svelte'

  const { blocked, failure }: { blocked?: boolean; failure?: boolean } = $props()
  let requests = $state(0)
  let complete: (() => void) | undefined = $state()
  const router: VoidRouter = {
    ...createSsrRouter('/settings/users'),
    visit: async () => {
      requests += 1
      await new Promise<void>((resolve) => {
        complete = resolve
      })
      complete = undefined
      if (failure) {
        throw new VoidActionError({ body: { error: 'Service indisponible' }, status: 500, statusText: 'Server Error', url: '/settings/users' })
      }
      return {}
    },
  }
  setContext('__void_router', router)
</script>

<Button onclick={() => complete?.()}>Terminer l'action</Button>
<p role="status">Actions: {requests}</p>
{#if blocked}<BlockUser userEmail="alice@example.com" userId="alice" />{:else}<ApproveUser userId="alice" />{/if}
