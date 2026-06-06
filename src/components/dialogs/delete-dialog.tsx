import { TrashIcon } from '@phosphor-icons/react'
import { useState, useTransition, type ComponentPropsWithoutRef, type ElementType } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'

import { Spinner } from '../ui/spinner'

interface DeleteDialogProps {
  actionLabel?: string
  deleteButtonLabel?: string
  description: string
  icon?: ElementType
  onDelete: () => Promise<void> | void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: string
  trigger?: ComponentPropsWithoutRef<typeof Dialog.Trigger>['render']
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

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      {!isControlled && (
        <Dialog.Trigger render={trigger}>
          <TriggerIcon /> {deleteButtonLabel}
        </Dialog.Trigger>
      )}
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Panel>{description}</Dialog.Panel>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="outline" />}>Annuler</Dialog.Close>
          <Button disabled={isLoading} onClick={handleDelete} variant="destructive">
            {isLoading && <Spinner />} {actionLabel}
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  )
}
