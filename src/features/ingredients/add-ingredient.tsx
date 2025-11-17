import { getFormDialog } from '@/components/dialogs/form-dialog'
import {
  createIngredientOptions,
  ingredientSchema,
  type IngredientFormInput,
} from '@/features/ingredients/api/create'
import {
  ingredientDefaultValues,
  IngredientForm,
  ingredientFormFields,
} from '@/features/ingredients/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { type JSX } from 'react'

interface AddIngredientProps {
  defaultValue?: string
  children: JSX.Element
}

const FormDialog = getFormDialog(ingredientDefaultValues)

export const AddIngredient = ({ defaultValue, children }: AddIngredientProps) => {
  const createMutation = useMutation(createIngredientOptions())

  const form = useAppForm({
    validators: {
      onDynamic: ingredientSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: {
      ...ingredientDefaultValues,
      name: defaultValue ?? ingredientDefaultValues.name,
    } as IngredientFormInput,
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync({
        data: ingredientSchema.parse(value),
      })
    },
  })

  return (
    <FormDialog trigger={children} title="Ajouter un ingrédient" submitLabel="Ajouter" form={form}>
      <IngredientForm form={form} fields={ingredientFormFields} />
    </FormDialog>
  )
}
