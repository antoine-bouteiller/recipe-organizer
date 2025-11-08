import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { type Unit } from '@/features/units/api/get-all'
import { updateUnitOptions } from '@/features/units/api/update'
import { type UnitFormInput, unitFormFields, UnitForm } from '@/features/units/unit-form'
import { useAppForm } from '@/hooks/use-app-form'
import { PencilSimpleIcon } from '@phosphor-icons/react'
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

interface EditUnitProps {
  unit: Unit
}

export const EditUnit = ({ unit }: EditUnitProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const updateMutation = useMutation(updateUnitOptions())

  const initialValues: UnitFormInput = {
    name: unit.name,
    symbol: unit.symbol,
    parentId: unit.parentId?.toString() ?? undefined,
    factor: unit.factor ?? undefined,
  }

  const form = useAppForm({
    validators: {
      onDynamic: unitSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: initialValues,
    onSubmit: async (data) => {
      try {
        const parsedData = unitSchema.parse(data.value)

        await updateMutation.mutateAsync({
          data: {
            id: unit.id,
            name: parsedData.name,
            symbol: parsedData.symbol,
            parentId: parsedData.parentId && parsedData.parentId !== ''
              ? Number(parsedData.parentId)
              : undefined,
            factor: parsedData.factor ?? undefined,
          },
        })

        setIsOpen(false)
      } catch (error) {
        toast.error("Une erreur est survenue lors de la modification de l'unité", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        })
      }
    },
  })

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogTrigger render={<Button variant="outline" size="sm" />}>
        <PencilSimpleIcon />
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Modifier l&apos;unité</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="px-4 md:px-0">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <UnitForm form={form} fields={unitFormFields} unit={unit} />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={form.state.isSubmitting}>
                Annuler
              </Button>
              <form.AppForm>
                <form.FormSubmit label="Mettre à jour" />
              </form.AppForm>
            </div>
          </form>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
