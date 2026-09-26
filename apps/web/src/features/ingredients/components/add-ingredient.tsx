import { createIngredientOptions, ingredientSchema } from '@client/features/ingredients/api/create'
import { getIngredientDefaultValues, IngredientForm } from '@client/features/ingredients/components/ingredient-form'
import { Button } from '@recipe-organizer/design-system/button'
import { getFormDialog } from '@recipe-organizer/design-system/form-dialog'
import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type { JSX } from 'react'

interface AddIngredientProps {
  children: JSX.Element
  defaultValue?: string
}

const FormDialog = getFormDialog(getIngredientDefaultValues())

export const AddIngredient = ({ children, defaultValue }: AddIngredientProps) => {
  const createMutation = useMutation(createIngredientOptions())
  const [open, setOpen] = useState(false)

  const form = useAppForm({
    defaultValues: getIngredientDefaultValues(defaultValue),
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(
        {
          data: ingredientSchema.parse(value),
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

export const renderAddIngredientOption = (inputValue: string) => (
  <AddIngredient defaultValue={inputValue} key={inputValue}>
    <Button size="sm" variant="list-action" width="full" align="start">
      <PlusIcon aria-hidden="true" size="sm" />
      Nouvel ingrédient: {inputValue}
    </Button>
  </AddIngredient>
)
