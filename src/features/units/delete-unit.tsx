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
import { deleteUnitOptions } from '@/features/units/api/delete'
import { TrashSimpleIcon } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

interface DeleteUnitProps {
  unitId: number
  unitName: string
}

export const DeleteUnit = ({ unitId, unitName }: DeleteUnitProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const deleteMutation = useMutation(deleteUnitOptions())

  const handleDelete = () => {
    deleteMutation.mutate(
      { data: { id: unitId } },
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
          <DialogTitle>Supprimer l&apos;unité</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer &quot;{unitName}&quot; ? Cette action est
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
