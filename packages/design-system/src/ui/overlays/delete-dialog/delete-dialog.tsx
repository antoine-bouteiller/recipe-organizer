import type { TriggerProps } from '@design-system/hooks/use-drawer'
import { Button } from '@recipe-organizer/design-system/button'
import { TrashIcon } from '@recipe-organizer/design-system/icons'
import { Spinner } from '@recipe-organizer/design-system/spinner'
import { useState, useTransition } from 'react'
import type { ElementType, ReactElement, ReactNode } from 'react'

import { Dialog } from '../dialog/dialog'

export interface DeleteDialogProps {
  actionLabel?: string
  deleteButtonLabel?: string
  description: string
  icon?: ElementType
  onDelete: () => Promise<void> | void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: string
  renderTrigger?: (props: TriggerProps & { children: ReactNode }) => ReactElement
}

const defaultTrigger: NonNullable<DeleteDialogProps['renderTrigger']> = (props) => <Button {...props} size="icon" variant="destructive" />

export const DeleteDialog = ({
  actionLabel = 'Supprimer',
  deleteButtonLabel,
  description,
  icon,
  onDelete,
  onOpenChange: onOpenChangeProp,
  open: openProp,
  title,
  renderTrigger = defaultTrigger,
}: DeleteDialogProps): ReactElement => {
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
    : (props: TriggerProps) =>
        renderTrigger({
          ...props,
          children: (
            <>
              <TriggerIcon /> {deleteButtonLabel}
            </>
          ),
        })

  return (
    <Dialog
      cancelDisabled={isLoading}
      cancelLabel="Annuler"
      footer={
        <Button disabled={isLoading} onClick={handleDelete} variant="destructive">
          {isLoading && <Spinner />} {actionLabel}
        </Button>
      }
      onOpenChange={setIsOpen}
      open={isOpen}
      title={title}
      renderTrigger={triggerNode}
    >
      {description}
    </Dialog>
  )
}
