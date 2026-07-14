import { Trash } from 'phosphor-solid'
import { createSignal, Show } from 'solid-js'

import { Button } from '@/components/ui/button'
import { Dialog, type TriggerConfig } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'

interface DeleteDialogProps {
  actionLabel?: string
  deleteButtonLabel?: string
  description: string
  icon?: typeof Trash
  onDelete: () => Promise<void> | void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: string
  trigger?: TriggerConfig
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

  const triggerConfig = (): TriggerConfig | undefined =>
    isControlled()
      ? undefined
      : {
          as: Button,
          size: 'icon',
          variant: 'destructive',
          ...props.trigger,
          children: (
            <>
              <TriggerIcon /> {props.deleteButtonLabel}
            </>
          ),
        }

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
      trigger={triggerConfig()}
    >
      {props.description}
    </Dialog>
  )
}
