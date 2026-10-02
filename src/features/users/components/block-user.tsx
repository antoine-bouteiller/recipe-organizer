import { usePageAction } from '@client/lib/page-action'
import { Button } from '@recipe-organizer/design-system/button'
import { DeleteDialog } from '@recipe-organizer/design-system/delete-dialog'
import { ProhibitIcon } from '@recipe-organizer/design-system/icons'

interface BlockUserProps {
  userEmail: string
  userId: string
}

export const BlockUser = ({ userEmail, userId }: BlockUserProps) => {
  const runPageAction = usePageAction()
  const handleBlock = async () => {
    await runPageAction('/settings/users?block', { data: { id: userId } }, "Erreur lors du blocage de l'utilisateur")
  }

  return (
    <DeleteDialog
      actionLabel="Bloquer"
      description={`Êtes-vous sûr de vouloir bloquer l'utilisateur ${userEmail} ?`}
      icon={ProhibitIcon}
      onDelete={handleBlock}
      title="Bloquer l'utilisateur"
      renderTrigger={(props) => <Button {...props} aria-label="Bloquer l'utilisateur" size="icon" variant="destructive-outline" />}
    />
  )
}
