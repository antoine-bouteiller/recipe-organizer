import { createUnitOptions } from '@/features/units/api/add-one'
import { unitDefaultValues, unitSchema } from '@/features/units/unit-form'
import { useAppForm } from '@/hooks/use-app-form'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UseUnitFormOptions {
  defaultValue?: string
  onSuccess?: () => void
}

export const useUnitForm = ({ defaultValue, onSuccess }: UseUnitFormOptions = {}) => {
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

  return form
}
