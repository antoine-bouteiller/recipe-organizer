import { CheckIcon } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { approveUserOptions } from '@/features/users/api/approve'

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
    <Button disabled={isPending} onClick={handleApprove} size="icon" variant="default">
      <CheckIcon />
    </Button>
  )
}
