import { useState } from 'react'
import type { ElementType, ReactElement, ReactNode } from 'react'

import { Button } from '@/components/ui/actions/button/button'
import { TrashIcon } from '@/components/ui/data-display/icons'
import { Spinner } from '@/components/ui/feedback/spinner/spinner'
import type { TriggerProps } from '@/hooks/use-drawer'

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
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete()
      setIsOpen(false)
    } catch (error) {
      setIsLoading(false)
      throw error
    }
    setIsLoading(false)
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
