import { DeleteDialog } from '@/components/dialogs/delete-dialog'
import { deleteUnitOptions } from '@/features/units/api/delete'
import { useMutation } from '@tanstack/react-query'

interface DeleteUnitProps {
  unitId: number
  unitName: string
}

export const DeleteUnit = ({ unitId, unitName }: DeleteUnitProps) => {
  const deleteMutation = useMutation(deleteUnitOptions())

  const handleDelete = () => deleteMutation.mutate({ data: { id: unitId } })

  return (
    <DeleteDialog
      title="Supprimer l'unité"
      description={`Êtes-vous sûr de vouloir supprimer "${unitName}" ? Cette action est irréversible.`}
      onDelete={handleDelete}
    />
  )
}
