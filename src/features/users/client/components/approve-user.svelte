<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { CheckIcon } from '@/components/ui/data-display/icons'
  import { alertError } from '@/lib/client/alert-error'
  import { usePageAction } from '@/lib/client/page-action.svelte'

  const { userId }: { userId: string } = $props()
  const runPageAction = usePageAction()
  let isPending = $state(false)
  const handleApprove = async () => {
    if (isPending) {
      return
    }
    isPending = true
    try {
      await runPageAction('/settings/users?approve', { data: { id: userId } }, "Erreur lors de l'approbation de l'utilisateur")
    } catch (error) {
      alertError("Erreur lors de l'approbation de l'utilisateur", error)
    } finally {
      isPending = false
    }
  }
</script>

<Button aria-label="Approuver l'utilisateur" disabled={isPending} onclick={handleApprove} size="icon" variant="default"><CheckIcon /></Button>
