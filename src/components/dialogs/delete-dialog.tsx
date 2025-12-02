import { TrashIcon } from '@phosphor-icons/react'
import { type ComponentPropsWithoutRef, useState, useTransition } from 'react'

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

import type { DialogTrigger } from '../ui/dialog'

import { Spinner } from '../ui/spinner'

interface DeleteDialogProps {
  deleteButtonLabel?: string
  description: string
  onDelete: () => Promise<void> | void
  title: string
  trigger?: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
}

export const DeleteDialog = ({
  deleteButtonLabel,
  description,
  onDelete,
  title,
  trigger = <Button size="icon" variant="destructive" />,
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
    <ResponsiveDialog onOpenChange={setIsOpen} open={isOpen}>
      <ResponsiveDialogTrigger render={trigger}>
        <TrashIcon /> {deleteButtonLabel}
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div
          className={`
            px-4 text-sm text-muted-foreground
            md:px-0
          `}
        >
          {description}
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline" />}>Annuler</ResponsiveDialogClose>
          <Button disabled={isLoading} onClick={handleDelete} variant="destructive">
            {isLoading && <Spinner />} Supprimer
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
