import { TrashIcon } from '@phosphor-icons/react'
import { type ComponentPropsWithoutRef, type ElementType, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogPanel,
  ResponsiveDialogPopup,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'

import type { DialogTrigger } from '../ui/dialog'
import { Spinner } from '../ui/spinner'

interface DeleteDialogProps {
  actionLabel?: string
  deleteButtonLabel?: string
  description: string
  icon?: ElementType
  onDelete: () => Promise<void> | void
  title: string
  trigger?: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
}

export const DeleteDialog = ({
  actionLabel = 'Supprimer',
  deleteButtonLabel,
  description,
  icon,
  onDelete,
  title,
  trigger = <Button size="icon" variant="destructive" />,
}: DeleteDialogProps) => {
  const TriggerIcon = icon ?? TrashIcon
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await onDelete()
      setIsOpen(false)
    })
  }

  return (
    <ResponsiveDialog onOpenChange={setIsOpen} open={isOpen}>
      <ResponsiveDialogTrigger render={trigger}>
        <TriggerIcon /> {deleteButtonLabel}
      </ResponsiveDialogTrigger>
      <ResponsiveDialogPopup>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <ResponsiveDialogPanel>{description}</ResponsiveDialogPanel>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline" />}>Annuler</ResponsiveDialogClose>
          <Button disabled={isLoading} onClick={handleDelete} variant="destructive">
            {isLoading && <Spinner />} {actionLabel}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogPopup>
    </ResponsiveDialog>
  )
}
