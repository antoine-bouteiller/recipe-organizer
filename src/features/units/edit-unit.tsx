import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { updateUnitOptions } from '@/features/units/api/update'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { UnitForm } from '@/features/units/unit-form'
import type { SelectUnit } from '@/lib/db/schema'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface EditUnitProps {
  unit: SelectUnit
}

export const EditUnit = ({ unit }: EditUnitProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const updateMutation = useMutation(updateUnitOptions())
  const { data: units } = useSuspenseQuery(getUnitsListOptions())

  const handleSubmit = (data: {
    name: string
    symbol: string
    parentId: number | null
    factor: number | null
  }) => {
    updateMutation.mutate(
      {
        data: {
          id: unit.id,
          name: data.name,
          symbol: data.symbol,
          parentId: data.parentId,
          factor: data.factor,
        },
      },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <PencilSimpleIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l&apos;unité</DialogTitle>
          <DialogDescription>Modifiez les informations de l&apos;unité</DialogDescription>
        </DialogHeader>
        <UnitForm
          unit={unit}
          units={units}
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          submitLabel="Mettre à jour"
        />
      </DialogContent>
    </Dialog>
  )
}
