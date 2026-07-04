import { PlusIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState, type JSX } from 'react'
import * as v from 'valibot'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { Button } from '@/components/ui/button'
import { createIngredientOptions, ingredientSchema } from '@/features/ingredients/api/create'
import { getIngredientDefaultValues, IngredientForm } from '@/features/ingredients/components/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'

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
          data: v.parse(ingredientSchema, value),
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
    <Button className="w-full justify-start px-1.5 font-normal" size="sm" variant="ghost">
      <PlusIcon aria-hidden="true" className="size-4" />
      Nouvel ingrédient: {inputValue}
    </Button>
  </AddIngredient>
)
