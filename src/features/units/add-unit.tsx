import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createUnitOptions } from '@/features/units/api/add-one'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { UnitForm } from '@/features/units/unit-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const AddUnit = () => {
  const [isOpen, setIsOpen] = useState(false)
  const createMutation = useMutation(createUnitOptions())
  const { data: units } = useSuspenseQuery(getUnitsListOptions())

  const handleSubmit = (data: {
    name: string
    symbol: string
    parentId: number | undefined
    factor: number | undefined
  }) => {
    createMutation.mutate(
      { data },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button />}>Ajouter une unité</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une unité</DialogTitle>
          <DialogDescription>Créez une nouvelle unité de mesure</DialogDescription>
        </DialogHeader>
        <UnitForm units={units} onSubmit={handleSubmit} onCancel={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
