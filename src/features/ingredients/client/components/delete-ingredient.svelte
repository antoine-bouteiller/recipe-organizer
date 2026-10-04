<script lang="ts">
  import DeleteDialog from '@/components/ui/overlays/delete-dialog/delete-dialog.svelte'
  import { alertError } from '@/lib/client/alert-error'
  import { usePageAction } from '@/lib/client/page-action.svelte'

  const { ingredientId, ingredientName }: { ingredientId: number; ingredientName: string } = $props()
  const runPageAction = usePageAction()
  const handleDelete = async () => {
    try {
      await runPageAction('/settings/ingredients?delete', { data: { id: ingredientId } }, "Erreur lors de la suppression de l'ingrédient")
    } catch (error) {
      alertError("Erreur lors de la suppression de l'ingrédient", error)
    }
  }
</script>

<DeleteDialog
  description={`Êtes-vous sûr de vouloir supprimer l'ingrédient ${ingredientName} ?`}
  onDelete={handleDelete}
  title="Supprimer l'ingrédient"
/>
