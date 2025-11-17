import { DeleteDialog } from '@/components/dialogs/delete-dialog'
import { deleteIngredientOptions } from '@/features/ingredients/api/delete'
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
      onDelete={handleDelete}
      title="Supprimer l'ingrédient"
      description={`Êtes-vous sûr de vouloir supprimer l'${ingredientName} ?`}
    />
  )
}
