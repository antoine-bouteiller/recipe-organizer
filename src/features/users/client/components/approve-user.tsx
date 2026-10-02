import { useState } from 'react'

import { Button } from '@/components/ui/actions/button/button'
import { CheckIcon } from '@/components/ui/data-display/icons'
import { usePageAction } from '@/lib/client/page-action'

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
