import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { useDeleteRecipeMutation } from '@/features/recipe/api/delete'
import { TrashIcon } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'

export default function DeleteRecipe({ recipeId }: { recipeId: number }) {
  const { mutateAsync: deleteRecipe } = useDeleteRecipeMutation()
  const router = useRouter()

  const handleDelete = useServerFn(async () => {
    try {
      await deleteRecipe({ data: recipeId })
      toast.success('Recette supprimée avec succès')
      await router.navigate({ to: '/' })
      return true
    } catch {
      toast.error('Une erreur est survenue lors de la suppression de la recette')
      return false
    }
  })

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button variant="ghost">
          <TrashIcon className="h-4 w-4" />
          Supprimer
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            Êtes-vous sûr de vouloir supprimer cette recette ?
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </ResponsiveDialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
