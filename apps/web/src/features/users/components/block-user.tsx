import { blockUserOptions } from '@client/features/users/api/block'
import { Button } from '@recipe-organizer/design-system/button'
import { DeleteDialog } from '@recipe-organizer/design-system/delete-dialog'
import { ProhibitIcon } from '@recipe-organizer/design-system/icons/prohibit'
import { useMutation } from '@tanstack/react-query'

interface BlockUserProps {
  userEmail: string
  userId: string
}

export const BlockUser = ({ userEmail, userId }: BlockUserProps) => {
  const blockMutation = useMutation(blockUserOptions())

  const handleBlock = () => blockMutation.mutate({ data: { id: userId } })

  return (
    <DeleteDialog
      actionLabel="Bloquer"
      description={`Êtes-vous sûr de vouloir bloquer l'utilisateur ${userEmail} ?`}
      icon={ProhibitIcon}
      onDelete={handleBlock}
      title="Bloquer l'utilisateur"
      trigger={<Button aria-label="Bloquer l'utilisateur" size="icon" variant="destructive-outline" />}
    />
  )
}
