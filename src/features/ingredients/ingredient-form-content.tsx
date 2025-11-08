import { Button } from '@/components/ui/button'
import { createIngredientOptions } from '@/features/ingredients/api/add-one'
import {
  ingredientDefaultValues,
  ingredientFormFields,
  IngredientForm,
} from '@/features/ingredients/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'

const ingredientSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
})

interface IngredientFormContentProps {
  defaultValue?: string
  onSuccess?: () => void
}

export const IngredientFormContent = ({ defaultValue, onSuccess }: IngredientFormContentProps) => {
  const createMutation = useMutation(createIngredientOptions())

  const form = useAppForm({
    validators: {
      onDynamic: ingredientSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: {
      ...ingredientDefaultValues,
      name: defaultValue ?? ingredientDefaultValues.name,
    },
    onSubmit: async (data) => {
      try {
        const parsedData = ingredientSchema.parse(data.value)

        await createMutation.mutateAsync({
          data: {
            name: parsedData.name,
            category: parsedData.category,
          },
        })

        form.reset()
        onSuccess?.()
      } catch (error) {
        toast.error("Une erreur est survenue lors de la création de l'ingrédient", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        })
      }
    },
  })

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Ajouter un ingrédient</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <IngredientForm form={form} fields={ingredientFormFields} />
        <div className="flex gap-2 justify-end">
          <form.AppForm>
            <form.FormSubmit label="Ajouter" />
          </form.AppForm>
        </div>
      </form>
    </div>
  )
}
