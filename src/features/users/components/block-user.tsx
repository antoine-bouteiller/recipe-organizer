import { useMutation } from '@tanstack/react-query'

import { DeleteDialog } from '@/components/dialogs/delete-dialog'
import { Button } from '@/components/ui/button'
import { blockUserOptions } from '@/features/users/api/block'

interface BlockUserProps {
  userEmail: string
  userId: string
}

export const BlockUser = ({ userEmail, userId }: BlockUserProps) => {
  const blockMutation = useMutation(blockUserOptions())

  const handleBlock = () => blockMutation.mutate({ data: { id: userId } })

  return (
    <DeleteDialog
      deleteButtonLabel="Bloquer"
      description={`Êtes-vous sûr de vouloir bloquer l'utilisateur ${userEmail} ?`}
      onDelete={handleBlock}
      title="Bloquer l'utilisateur"
      trigger={<Button size="icon" variant="destructive-outline" />}
    />
  )
}
