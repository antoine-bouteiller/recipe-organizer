<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { ProhibitIcon } from '@/components/ui/data-display/icons'
  import DeleteDialog from '@/components/ui/overlays/delete-dialog/delete-dialog.svelte'
  import { alertError } from '@/lib/client/alert-error'
  import { usePageAction } from '@/lib/client/page-action.svelte'

  const { userEmail, userId }: { userEmail: string; userId: string } = $props()
  const runPageAction = usePageAction()
  const handleBlock = async () => {
    try {
      await runPageAction('/settings/users?block', { data: { id: userId } }, "Erreur lors du blocage de l'utilisateur")
    } catch (error) {
      alertError("Erreur lors du blocage de l'utilisateur", error)
    }
  }
</script>

<DeleteDialog
  actionLabel="Bloquer"
  description={`Êtes-vous sûr de vouloir bloquer l'utilisateur ${userEmail} ?`}
  icon={ProhibitIcon}
  onDelete={handleBlock}
  title="Bloquer l'utilisateur"
>
  {#snippet renderTrigger(props)}<Button {...props} aria-label="Bloquer l'utilisateur" size="icon" variant="destructive-outline" />{/snippet}
</DeleteDialog>
