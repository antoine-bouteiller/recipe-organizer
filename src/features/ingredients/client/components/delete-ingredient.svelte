<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query'

  import DeleteDialog from '@/components/ui/overlays/delete-dialog/delete-dialog.svelte'
  import { deleteIngredientMutation } from '@/features/ingredients/client/api/delete'
  import { alertError } from '@/lib/client/alert-error'

  const { ingredientId, ingredientName }: { ingredientId: number; ingredientName: string } = $props()
  const mutation = createMutation(() => deleteIngredientMutation())
  const handleDelete = async () => {
    try {
      await mutation.mutateAsync(ingredientId)
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
