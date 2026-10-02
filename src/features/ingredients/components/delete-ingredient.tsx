import { usePageAction } from '@client/lib/page-action'
import { DeleteDialog } from '@recipe-organizer/design-system/delete-dialog'

interface DeleteIngredientProps {
  ingredientId: number
  ingredientName: string
}

export const DeleteIngredient = ({ ingredientId, ingredientName }: DeleteIngredientProps) => {
  const runPageAction = usePageAction()
  const handleDelete = async () => {
    await runPageAction('/settings/ingredients?delete', { data: { id: ingredientId } }, "Erreur lors de la suppression de l'ingrédient")
  }

  return (
    <DeleteDialog
      description={`Êtes-vous sûr de vouloir supprimer l'ingrédient ${ingredientName} ?`}
      onDelete={handleDelete}
      title="Supprimer l'ingrédient"
    />
  )
}
