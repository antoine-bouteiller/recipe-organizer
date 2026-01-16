import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { type JSX, useState } from 'react'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { createIngredientOptions, type IngredientFormInput, ingredientSchema } from '@/features/ingredients/api/create'
import { ingredientDefaultValues, IngredientForm } from '@/features/ingredients/components/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'

interface AddIngredientProps {
  children: JSX.Element
  defaultValue?: string
}

const FormDialog = getFormDialog(ingredientDefaultValues)

export const AddIngredient = ({ children, defaultValue }: AddIngredientProps) => {
  const createMutation = useMutation(createIngredientOptions())
  const [open, setOpen] = useState(false)

  const form = useAppForm({
    defaultValues: {
      ...ingredientDefaultValues,
      name: defaultValue ?? ingredientDefaultValues.name,
    } as IngredientFormInput,
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(
        {
          data: ingredientSchema.assert(value),
        },
        {
          onSuccess: () => {
            form.reset()
            setOpen(false)
          },
        }
      )
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ingredientSchema,
    },
  })

  return (
    <FormDialog form={form} open={open} setOpen={setOpen} submitLabel="Ajouter" title="Ajouter un ingrédient" trigger={children}>
      <IngredientForm form={form} />
    </FormDialog>
  )
}
