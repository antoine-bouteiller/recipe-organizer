<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query'

  import Button from '@/components/ui/actions/button/button.svelte'
  import { CheckIcon } from '@/components/ui/data-display/icons'
  import { updateUserStatusMutation } from '@/features/users/client/api/update-status'
  import { alertError } from '@/lib/client/alert-error'

  const { userId }: { userId: string } = $props()
  const mutation = createMutation(() => updateUserStatusMutation(userId))
  let isPending = $state(false)
  const handleApprove = async () => {
    if (isPending) {
      return
    }
    isPending = true
    try {
      await mutation.mutateAsync('active')
    } catch (error) {
      alertError("Erreur lors de l'approbation de l'utilisateur", error)
    } finally {
      isPending = false
    }
  }
</script>

<Button aria-label="Approuver l'utilisateur" disabled={isPending} onclick={handleApprove} size="icon" variant="default"><CheckIcon /></Button>
