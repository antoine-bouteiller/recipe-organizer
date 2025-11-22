import { getFormDialog } from '@/components/dialogs/form-dialog'
import { Button } from '@/components/ui/button'
import { ingredientSchema } from '@/features/ingredients/api/create'
import {
  updateIngredientOptions,
  updateIngredientSchema,
  type UpdateIngredientFormInput,
} from '@/features/ingredients/api/update'
import {
  IngredientForm,
  ingredientDefaultValues,
} from '@/features/ingredients/components/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'
import type { Ingredient } from '@/types/ingredient'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

interface EditIngredientProps {
  ingredient: Ingredient
}

const FormDialog = getFormDialog(ingredientDefaultValues)

export const EditIngredient = ({ ingredient }: EditIngredientProps) => {
  const updateMutation = useMutation(updateIngredientOptions())
  const [open, setOpen] = useState(false)

  const initialValues: UpdateIngredientFormInput = {
    id: ingredient.id,
    name: ingredient.name,
    category: ingredient.category,
  }

  const form = useAppForm({
    validators: {
      onDynamic: ingredientSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: initialValues,
    onSubmit: async (data) => {
      await updateMutation.mutateAsync(
        {
          data: updateIngredientSchema.parse(data.value),
        },
        {
          onSuccess: () => {
            form.reset()
            setOpen(false)
          },
        }
      )
    },
  })

  return (
    <FormDialog
      trigger={
        <Button variant="outline" size="icon">
          <PencilSimpleIcon />
        </Button>
      }
      open={open}
      setOpen={setOpen}
      title="Modifier l'ingrédient"
      submitLabel="Mettre à jour"
      form={form}
    >
      <IngredientForm form={form} />
    </FormDialog>
  )
}
