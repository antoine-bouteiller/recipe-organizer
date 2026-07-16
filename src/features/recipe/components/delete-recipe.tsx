import { useMutation } from '@tanstack/solid-query'
import { useRouter } from '@tanstack/solid-router'

import { DeleteDialog } from '@/components/dialogs/delete-dialog'
import { toastManager } from '@/components/ui/toast'
import { deleteRecipeOptions } from '@/features/recipe/api/delete'

interface DeleteRecipeProps {
  recipeId: number
  recipeName: string
}

export default function DeleteRecipe(props: Readonly<DeleteRecipeProps>) {
  const mutation = useMutation(() => deleteRecipeOptions())
  const router = useRouter()

  const handleDelete = async () => {
    await mutation.mutateAsync(
      { data: props.recipeId },
      {
        onError: () =>
          toastManager.add({
            description: 'Une erreur est survenue lors de la suppression de la recette',
            title: 'Erreur',
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
  }

  return (
    <DeleteDialog
      deleteButtonLabel="Supprimer la recette"
      description={`Êtes-vous sûr de vouloir supprimer la recette ${props.recipeName}?`}
      onDelete={handleDelete}
      title="Supprimer la recette"
      trigger={{ class: 'text-destructive hover:text-destructive', variant: 'ghost' }}
    />
  )
}
