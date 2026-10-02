import { usePageAction } from '@client/lib/page-action'
import { Button } from '@recipe-organizer/design-system/button'
import { CheckIcon } from '@recipe-organizer/design-system/icons'
import { useState } from 'react'

interface ApproveUserProps {
  userId: string
}

export const ApproveUser = ({ userId }: ApproveUserProps) => {
  const runPageAction = usePageAction()
  const [isPending, setIsPending] = useState(false)

  const handleApprove = async () => {
    setIsPending(true)
    try {
      await runPageAction('/settings/users?approve', { data: { id: userId } }, "Erreur lors de l'approbation de l'utilisateur")
    } catch (error) {
      setIsPending(false)
      throw error
    }
    setIsPending(false)
  }

  return (
    <Button aria-label="Approuver l'utilisateur" disabled={isPending} onClick={handleApprove} size="icon" variant="default">
      <CheckIcon />
    </Button>
  )
}
