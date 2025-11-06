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
import { unitDefaultValues, unitFormFields, UnitForm } from '@/features/units/unit-form'
import { useAppForm } from '@/hooks/use-app-form'
import { PlusIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const unitSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  symbol: z.string().min(1, 'Le symbole est requis'),
  parentId: z.string().nullish(),
  factor: z.number().positive('Le facteur doit être positif').nullish(),
})

export const AddUnit = () => {
  const [isOpen, setIsOpen] = useState(false)
  const createMutation = useMutation(createUnitOptions())

  const form = useAppForm({
    validators: {
      onDynamic: unitSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: unitDefaultValues,
    onSubmit: async (data) => {
      try {
        const parsedData = unitSchema.parse(data.value)

        await createMutation.mutateAsync({
          data: {
            name: parsedData.name,
            symbol: parsedData.symbol,
            parentId: parsedData.parentId && parsedData.parentId !== ''
              ? Number(parsedData.parentId)
              : null,
            factor: parsedData.factor ?? null,
          },
        })

        setIsOpen(false)
        form.reset()
      } catch (error) {
        toast.error("Une erreur est survenue lors de la création de l'unité", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        })
      }
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="default" size="sm" />}>
        <PlusIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une unité</DialogTitle>
          <DialogDescription>Ajoutez une nouvelle unité de mesure</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
          className="space-y-4"
        >
          <UnitForm form={form} fields={unitFormFields} onCancel={() => setIsOpen(false)} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
