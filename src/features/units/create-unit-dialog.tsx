import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog'
import { createUnitOptions } from '@/features/units/api/add-one'
import { unitDefaultValues, unitFormFields, UnitForm } from '@/features/units/unit-form'
import { useAppForm } from '@/hooks/use-app-form'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const unitSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  symbol: z.string().min(1, 'Le symbole est requis'),
  parentId: z.string().nullish(),
  factor: z.number().positive('Le facteur doit être positif').nullish(),
})

interface CreateUnitDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialSymbol?: string
  onSuccess?: () => void
}

export const CreateUnitDialog = ({
  isOpen,
  onOpenChange,
  initialSymbol,
  onSuccess,
}: CreateUnitDialogProps) => {
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

        onOpenChange(false)
        form.reset()
        onSuccess?.()
      } catch (error) {
        toast.error("Une erreur est survenue lors de la création de l'unité", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        })
      }
    },
  })

  // Update form when initialSymbol changes
  useEffect(() => {
    if (isOpen && initialSymbol) {
      form.setFieldValue('symbol', initialSymbol)
    }
  }, [isOpen, initialSymbol, form])

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Ajouter une unité</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <UnitForm form={form} fields={unitFormFields} />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={form.state.isSubmitting}
            >
              Annuler
            </Button>
            <form.AppForm>
              <form.FormSubmit label="Ajouter" />
            </form.AppForm>
          </div>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
