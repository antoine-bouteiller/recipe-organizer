import { type VariantProps } from 'class-variance-authority'
import { createSignal, Show } from 'solid-js'
import Trash from '~icons/ph/trash'

import { Button, type buttonVariants } from '@/components/ui/button'
import { Dialog, type TriggerRender } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'

type ButtonVariants = VariantProps<typeof buttonVariants>

interface DeleteDialogProps {
  actionLabel?: string
  deleteButtonLabel?: string
  description: string
  icon?: typeof Trash
  onDelete: () => Promise<void> | void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: string
  trigger?: { class?: string; variant?: ButtonVariants['variant']; size?: ButtonVariants['size'] }
}

export const DeleteDialog = (props: DeleteDialogProps) => {
  const [internalOpen, setInternalOpen] = createSignal(false)
  const [isLoading, setIsLoading] = createSignal(false)
  const TriggerIcon = props.icon ?? Trash

  const isControlled = () => props.open !== undefined
  const isOpen = () => (isControlled() ? props.open : internalOpen())

  const setIsOpen = (value: boolean) => {
    if (!isControlled()) {
      setInternalOpen(value)
    }
    props.onOpenChange?.(value)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await props.onDelete()
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerRender = (): TriggerRender | undefined =>
    isControlled()
      ? undefined
      : (Trigger) => (
          <Trigger as={Button} size="icon" variant="destructive" {...props.trigger}>
            <TriggerIcon /> {props.deleteButtonLabel}
          </Trigger>
        )

  return (
    <Dialog
      cancelLabel="Annuler"
      footer={
        <Button disabled={isLoading()} onClick={handleDelete} variant="destructive">
          <Show when={isLoading()}>
            <Spinner />
          </Show>{' '}
          {props.actionLabel ?? 'Supprimer'}
        </Button>
      }
      onOpenChange={setIsOpen}
      open={isOpen()}
      title={props.title}
      trigger={triggerRender()}
    >
      {props.description}
    </Dialog>
  )
}
