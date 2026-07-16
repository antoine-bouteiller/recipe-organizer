import { useMutation } from '@tanstack/solid-query'

import { DeleteDialog } from '@/components/dialogs/delete-dialog'
import { deleteIngredientOptions } from '@/features/ingredients/api/delete'

interface DeleteIngredientProps {
  ingredientId: number
  ingredientName: string
}

export const DeleteIngredient = (props: DeleteIngredientProps) => {
  const deleteMutation = useMutation(() => deleteIngredientOptions())

  const handleDelete = () => deleteMutation.mutate({ data: { id: props.ingredientId } })

  return (
    <DeleteDialog
      description={`Êtes-vous sûr de vouloir supprimer l'ingrédient ${props.ingredientName} ?`}
      onDelete={handleDelete}
      title="Supprimer l'ingrédient"
    />
  )
}
