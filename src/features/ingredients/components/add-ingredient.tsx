import { revalidateLogic } from '@tanstack/solid-form'
import { useMutation } from '@tanstack/solid-query'
import { createSignal } from 'solid-js'
import * as v from 'valibot'
import Plus from '~icons/ph/plus'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { Button } from '@/components/ui/button'
import { type TriggerRender } from '@/components/ui/dialog'
import { createIngredientOptions, ingredientSchema } from '@/features/ingredients/api/create'
import { getIngredientDefaultValues, IngredientForm } from '@/features/ingredients/components/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'

interface AddIngredientProps {
  defaultValue?: string
  trigger: TriggerRender
}

const FormDialog = getFormDialog(getIngredientDefaultValues())

export const AddIngredient = (props: AddIngredientProps) => {
  const createMutation = useMutation(() => createIngredientOptions())
  const [open, setOpen] = createSignal(false)

  const form = useAppForm(() => ({
    defaultValues: getIngredientDefaultValues(props.defaultValue),
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(
        { data: v.parse(ingredientSchema, value) },
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
  }))

  return (
    <FormDialog form={form} open={open()} setOpen={setOpen} submitLabel="Ajouter" title="Ajouter un ingrédient" trigger={props.trigger}>
      <IngredientForm form={form} />
    </FormDialog>
  )
}

export const renderAddIngredientOption = (inputValue: string) => (
  <AddIngredient
    defaultValue={inputValue}
    trigger={(Trigger) => (
      <Trigger as={Button} class="w-full justify-start px-1.5 font-normal" size="sm" variant="ghost">
        <Plus aria-hidden="true" class="size-4" />
        Nouvel ingrédient: {inputValue}
      </Trigger>
    )}
  />
)
