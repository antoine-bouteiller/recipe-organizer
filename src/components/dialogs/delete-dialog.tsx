import { TrashIcon } from '@phosphor-icons/react'
import { cloneElement, useState, useTransition, type ElementType, type ReactElement } from 'react'

import { Dialog } from '@/components/common/dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface DeleteDialogProps {
  actionLabel?: string
  deleteButtonLabel?: string
  description: string
  icon?: ElementType
  onDelete: () => Promise<void> | void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: string
  trigger?: ReactElement
}

const DefaultTrigger = <Button size="icon" variant="destructive" />

export const DeleteDialog = ({
  actionLabel = 'Supprimer',
  deleteButtonLabel,
  description,
  icon,
  onDelete,
  onOpenChange: onOpenChangeProp,
  open: openProp,
  title,
  trigger = DefaultTrigger,
}: DeleteDialogProps) => {
  const TriggerIcon = icon ?? TrashIcon
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = openProp !== undefined
  const isOpen = isControlled ? openProp : internalOpen
  const setIsOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value)
    }
    onOpenChangeProp?.(value)
  }
  const [isLoading, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await onDelete()
      setIsOpen(false)
    })
  }

  const triggerNode = isControlled
    ? undefined
    : cloneElement(
        trigger,
        undefined,
        <>
          <TriggerIcon /> {deleteButtonLabel}
        </>
      )

  return (
    <Dialog
      cancelLabel="Annuler"
      footer={
        <Button disabled={isLoading} onClick={handleDelete} variant="destructive">
          {isLoading && <Spinner />} {actionLabel}
        </Button>
      }
      onOpenChange={setIsOpen}
      open={isOpen}
      title={title}
      trigger={triggerNode}
    >
      {description}
    </Dialog>
  )
}
