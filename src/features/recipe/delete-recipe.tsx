import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deleteRecipeMutationQueryOptions } from '@/features/recipe/api/delete'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function DeleteRecipe({ recipeId }: { recipeId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const { mutateAsync: deleteRecipe } = useMutation(deleteRecipeMutationQueryOptions)
  const router = useRouter()

  const handleDelete = useServerFn(async () => {
    try {
      await deleteRecipe({ data: recipeId })
      setIsOpen(false)
      toast.success('Recette supprimée avec succès')
      await router.navigate({ to: '/' })
    } catch {
      toast.error('Une erreur est survenue lors de la suppression de la recette')
    }
  })

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          asChild
          onClick={(event) => {
            event.preventDefault()
            setIsOpen(true)
          }}
        >
          <Button variant="ghost">
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr de vouloir supprimer cette recette ?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
