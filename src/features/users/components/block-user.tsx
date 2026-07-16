import { useMutation } from '@tanstack/solid-query'
import Prohibit from '~icons/ph/prohibit'

import { DeleteDialog } from '@/components/dialogs/delete-dialog'
import { blockUserOptions } from '@/features/users/api/block'

interface BlockUserProps {
  onOpenChange?: (open: boolean) => void
  open?: boolean
  userEmail: string
  userId: string
}

export const BlockUser = (props: BlockUserProps) => {
  const blockMutation = useMutation(() => blockUserOptions())

  const handleBlock = () => blockMutation.mutate({ data: { id: props.userId } })

  return (
    <DeleteDialog
      actionLabel="Bloquer"
      description={`Êtes-vous sûr de vouloir bloquer l'utilisateur ${props.userEmail} ?`}
      icon={Prohibit}
      onDelete={handleBlock}
      onOpenChange={props.onOpenChange}
      open={props.open}
      title="Bloquer l'utilisateur"
      trigger={{ size: 'icon', variant: 'destructive-outline' }}
    />
  )
}
