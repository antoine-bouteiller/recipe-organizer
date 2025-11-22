import { DeleteDialog } from '@/components/dialogs/delete-dialog'
import { Button } from '@/components/ui/button'
import { toastManager } from '@/components/ui/toast'
import { deleteRecipeOptions } from '@/features/recipe/api/delete'
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
      description={`Êtes-vous sûr de vouloir supprimer la recette ${recipeName}?`}
      title="Supprimer la recette"
      onDelete={handleDelete}
      deleteButtonLabel="Supprimer la recette"
      trigger={<Button variant="ghost" className="text-destructive hover:text-destructive" />}
    />
  )
}
