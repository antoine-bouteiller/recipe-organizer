import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import { Button } from '@/components/common/button'
import { toastManager } from '@/components/common/toast'
import { DeleteDialog } from '@/components/dialogs/delete-dialog'
import { deleteRecipeOptions } from '@/features/recipe/api/delete'

interface DeleteRecipeProps {
  recipeId: number
  recipeName: string
}

export default function DeleteRecipe({ recipeId, recipeName }: Readonly<DeleteRecipeProps>) {
  const { mutateAsync: deleteRecipe } = useMutation(deleteRecipeOptions())
  const router = useRouter()

  const handleDelete = () =>
    deleteRecipe(
      { data: recipeId },
      {
        onError: () =>
          toastManager.add({
            description: 'Une erreur est survenue lors de la suppression de la recette',
            type: 'error',
          }),
        onSuccess: () => {
          toastManager.add({
            title: 'Recette supprimée avec succès',
            type: 'success',
          })
          void router.navigate({ to: '/' })
        },
      }
    )

  return (
    <DeleteDialog
      deleteButtonLabel="Supprimer la recette"
      description={`Êtes-vous sûr de vouloir supprimer la recette ${recipeName}?`}
      onDelete={handleDelete}
      title="Supprimer la recette"
      trigger={<Button className="text-destructive hover:text-destructive" variant="ghost" />}
    />
  )
}
