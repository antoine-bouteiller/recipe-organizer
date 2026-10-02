import { Button } from '@/components/ui/actions/button/button'
import { ProhibitIcon } from '@/components/ui/data-display/icons'
import { DeleteDialog } from '@/components/ui/overlays/delete-dialog/delete-dialog'
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
