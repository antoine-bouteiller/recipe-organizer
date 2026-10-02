import { Button } from '@/design-system/ui/actions/button/button'
import { ProhibitIcon } from '@/design-system/ui/data-display/icons'
import { DeleteDialog } from '@/design-system/ui/overlays/delete-dialog/delete-dialog'
import { usePageAction } from '@/lib/client/page-action'

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
