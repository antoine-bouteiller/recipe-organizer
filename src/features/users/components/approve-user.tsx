import { useMutation } from '@tanstack/solid-query'
import { createSignal } from 'solid-js'
import Check from '~icons/ph/check'

import { Button } from '@/components/ui/button'
import { approveUserOptions } from '@/features/users/api/approve'

interface ApproveUserProps {
  userId: string
}

export const ApproveUser = (props: ApproveUserProps) => {
  const approveMutation = useMutation(() => approveUserOptions())
  const [isPending, setIsPending] = createSignal(false)

  const handleApprove = async () => {
    setIsPending(true)
    try {
      await approveMutation.mutateAsync({ data: { id: props.userId } })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button disabled={isPending()} onClick={handleApprove} size="icon" variant="default">
      <Check />
    </Button>
  )
}
