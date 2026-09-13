import { DeleteDialog } from '@client/components/dialogs/delete-dialog'
import { ProhibitIcon } from '@client/components/icons'
import { Button } from '@client/components/ui/button'
import { blockUserOptions } from '@client/features/users/api/block'
import { useMutation } from '@tanstack/react-query'

interface BlockUserProps {
  onOpenChange?: (open: boolean) => void
  open?: boolean
  userEmail: string
  userId: string
}

export const BlockUser = ({ onOpenChange, open, userEmail, userId }: BlockUserProps) => {
  const blockMutation = useMutation(blockUserOptions())

  const handleBlock = () => blockMutation.mutate({ data: { id: userId } })

  return (
    <DeleteDialog
      actionLabel="Bloquer"
      description={`Êtes-vous sûr de vouloir bloquer l'utilisateur ${userEmail} ?`}
      icon={ProhibitIcon}
      onDelete={handleBlock}
      onOpenChange={onOpenChange}
      open={open}
      title="Bloquer l'utilisateur"
      trigger={<Button size="icon" variant="destructive-outline" />}
    />
  )
}
