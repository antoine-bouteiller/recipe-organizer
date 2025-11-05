import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deleteIngredientOptions } from '@/features/ingredients/api/delete'
import { TrashSimpleIcon } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

interface DeleteIngredientProps {
  ingredientId: number
  ingredientName: string
}

export const DeleteIngredient = ({ ingredientId, ingredientName }: DeleteIngredientProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const deleteMutation = useMutation(deleteIngredientOptions())

  const handleDelete = () => {
    deleteMutation.mutate(
      { data: { id: ingredientId } },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        <TrashSimpleIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;ingrédient</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer &quot;{ingredientName}&quot; ? Cette action est
            irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
