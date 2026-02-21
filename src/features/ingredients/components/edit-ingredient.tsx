import { PencilSimpleIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import * as v from 'valibot'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { Button } from '@/components/ui/button'
import { ingredientSchema } from '@/features/ingredients/api/create'
import { type UpdateIngredientFormInput, updateIngredientOptions, updateIngredientSchema } from '@/features/ingredients/api/update'
import { ingredientDefaultValues, IngredientForm } from '@/features/ingredients/components/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'
import type { Ingredient } from '@/types/ingredient'

interface EditIngredientProps {
  ingredient: Ingredient
}

const FormDialog = getFormDialog(ingredientDefaultValues)

export const EditIngredient = ({ ingredient }: EditIngredientProps) => {
  const updateMutation = useMutation(updateIngredientOptions())
  const [open, setOpen] = useState(false)

  const initialValues: UpdateIngredientFormInput = {
    category: ingredient.category,
    id: ingredient.id,
    name: ingredient.name,
    parentId: ingredient.parentId ?? undefined,
  }

  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: async (data) => {
      await updateMutation.mutateAsync(
        {
          data: v.parse(updateIngredientSchema, data.value),
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
    <FormDialog
      form={form}
      open={open}
      setOpen={setOpen}
      submitLabel="Mettre à jour"
      title="Modifier l'ingrédient"
      trigger={
        <Button size="icon" variant="outline">
          <PencilSimpleIcon />
        </Button>
      }
    >
      <IngredientForm form={form} />
    </FormDialog>
  )
}
