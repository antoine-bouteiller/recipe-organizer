import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { TrashIcon } from '@phosphor-icons/react'
import { useState, useTransition, type ComponentPropsWithoutRef } from 'react'
import type { DialogTrigger } from '../ui/dialog'
import { Spinner } from '../ui/spinner'

interface DeleteDialogProps {
  title: string
  onDelete: () => Promise<void> | void
  description: string
  deleteButtonLabel?: string
  trigger?: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
}

export const DeleteDialog = ({
  title,
  onDelete,
  description,
  deleteButtonLabel,
  trigger = <Button variant="destructive" size="icon" />,
}: DeleteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await onDelete()
      setIsOpen(false)
    })
  }

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogTrigger render={trigger}>
        <TrashIcon /> {deleteButtonLabel}
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="px-4 md:px-0 text-sm text-muted-foreground">{description}</div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline" />}>
            Annuler
          </ResponsiveDialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Spinner />} Supprimer
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
