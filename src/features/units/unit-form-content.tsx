import { Button } from '@/components/ui/button'
import { createUnitOptions } from '@/features/units/api/add-one'
import { unitDefaultValues, unitFormFields, UnitForm } from '@/features/units/unit-form'
import { useAppForm } from '@/hooks/use-app-form'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'

const unitSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  symbol: z.string().min(1, 'Le symbole est requis'),
  parentId: z.string().nullish(),
  factor: z.number().positive('Le facteur doit être positif').nullish(),
})

interface UnitFormContentProps {
  defaultValue?: string
  onSuccess?: () => void
}

export const UnitFormContent = ({ defaultValue, onSuccess }: UnitFormContentProps) => {
  const createMutation = useMutation(createUnitOptions())

  const form = useAppForm({
    validators: {
      onDynamic: unitSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: {
      ...unitDefaultValues,
      symbol: defaultValue ?? unitDefaultValues.symbol,
    },
    onSubmit: async (data) => {
      try {
        const parsedData = unitSchema.parse(data.value)

        await createMutation.mutateAsync({
          data: {
            name: parsedData.name,
            symbol: parsedData.symbol,
            parentId: parsedData.parentId && parsedData.parentId !== ''
              ? Number(parsedData.parentId)
              : undefined,
            factor: parsedData.factor ?? undefined,
          },
        })

        form.reset()
        onSuccess?.()
      } catch (error) {
        toast.error("Une erreur est survenue lors de la création de l'unité", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        })
      }
    },
  })

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Ajouter une unité</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <UnitForm form={form} fields={unitFormFields} />
        <div className="flex gap-2 justify-end">
          <form.AppForm>
            <form.FormSubmit label="Ajouter" />
          </form.AppForm>
        </div>
      </form>
    </div>
  )
}
