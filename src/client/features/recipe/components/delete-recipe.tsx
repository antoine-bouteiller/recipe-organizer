import { DeleteDialog } from '@client/components/dialogs/delete-dialog'
import { Button } from '@client/components/ui/button'
import { toastManager } from '@client/components/ui/toast'
import { deleteRecipeOptions } from '@client/features/recipe/api/delete'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

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
