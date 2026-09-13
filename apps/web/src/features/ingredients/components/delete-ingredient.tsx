import { DeleteDialog } from '@client/components/dialogs/delete-dialog'
import { deleteIngredientOptions } from '@client/features/ingredients/api/delete'
import { useMutation } from '@tanstack/react-query'

interface DeleteIngredientProps {
  ingredientId: number
  ingredientName: string
}

export const DeleteIngredient = ({ ingredientId, ingredientName }: DeleteIngredientProps) => {
  const deleteMutation = useMutation(deleteIngredientOptions())

  const handleDelete = () => deleteMutation.mutate({ data: { id: ingredientId } })

  return (
    <DeleteDialog
      description={`Êtes-vous sûr de vouloir supprimer l'ingrédient ${ingredientName} ?`}
      onDelete={handleDelete}
      title="Supprimer l'ingrédient"
    />
  )
}
