import { approveUserOptions } from '@client/features/users/api/approve'
import { Button } from '@recipe-organizer/design-system/button'
import { CheckIcon } from '@recipe-organizer/design-system/icons/check'
import { useMutation } from '@tanstack/react-query'
import { useTransition } from 'react'

interface ApproveUserProps {
  userId: string
}

export const ApproveUser = ({ userId }: ApproveUserProps) => {
  const approveMutation = useMutation(approveUserOptions())
  const [isPending, startTransition] = useTransition()

  const handleApprove = () => {
    startTransition(async () => {
      await approveMutation.mutateAsync({ data: { id: userId } })
    })
  }

  return (
    <Button aria-label="Approuver l'utilisateur" disabled={isPending} onClick={handleApprove} size="icon" variant="default">
      <CheckIcon />
    </Button>
  )
}
