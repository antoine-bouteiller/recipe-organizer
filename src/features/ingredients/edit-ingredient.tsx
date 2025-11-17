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
  ingredientFormFields,
} from '@/features/ingredients/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'
import type { Ingredient } from '@/types/ingredient'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'

interface EditIngredientProps {
  ingredient: Ingredient
}

const FormDialog = getFormDialog(ingredientDefaultValues)

export const EditIngredient = ({ ingredient }: EditIngredientProps) => {
  const updateMutation = useMutation(updateIngredientOptions())

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
      await updateMutation.mutateAsync({
        data: updateIngredientSchema.parse(data.value),
      })
    },
  })

  return (
    <FormDialog
      trigger={
        <Button variant="outline" size="icon">
          <PencilSimpleIcon />
        </Button>
      }
      title="Modifier l'ingrédient"
      submitLabel="Mettre à jour"
      form={form}
    >
      <IngredientForm form={form} fields={ingredientFormFields} />
    </FormDialog>
  )
}
