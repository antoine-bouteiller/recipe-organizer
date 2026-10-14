<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query'

  import Button from '@/components/ui/actions/button/button.svelte'
  import { ProhibitIcon } from '@/components/ui/data-display/icons'
  import DeleteDialog from '@/components/ui/overlays/delete-dialog/delete-dialog.svelte'
  import { updateUserStatusMutation } from '@/features/users/client/api/update-status'
  import { alertError } from '@/lib/client/alert-error'

  const { userEmail, userId }: { userEmail: string; userId: string } = $props()
  const mutation = createMutation(() => updateUserStatusMutation(userId))
  const handleBlock = async () => {
    try {
      await mutation.mutateAsync('blocked')
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
