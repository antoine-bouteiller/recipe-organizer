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
import { deleteIngredientOptions } from '@/features/ingredients/api/delete'
import { useMutation } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

interface DeleteIngredientProps {
  ingredientId: number
  ingredientName: string
  children: ReactNode
}

export const DeleteIngredient = ({
  ingredientId,
  ingredientName,
  children,
}: DeleteIngredientProps) => {
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
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogTrigger render={children} />
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Supprimer l&apos;ingrédient</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="px-4 md:px-0 text-sm text-muted-foreground">
          Êtes-vous sûr de vouloir supprimer &quot;{ingredientName}&quot; ? Cette action est
          irréversible.
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline" />}>
            Annuler
          </ResponsiveDialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
