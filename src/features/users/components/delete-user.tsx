import { useMutation } from '@tanstack/react-query'

import { DeleteDialog } from '@/components/dialogs/delete-dialog'
import { deleteUserOptions } from '@/features/users/api/delete'

interface DeleteUserProps {
  userEmail: string
  userId: string
}

export const DeleteUser = ({ userEmail, userId }: DeleteUserProps) => {
  const deleteMutation = useMutation(deleteUserOptions())

  const handleDelete = () => deleteMutation.mutate({ data: { id: userId } })

  return (
    <DeleteDialog
      description={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userEmail} ?`}
      onDelete={handleDelete}
      title="Supprimer l'utilisateur"
    />
  )
}
