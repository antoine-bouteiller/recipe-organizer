import { revalidateLogic } from '@tanstack/solid-form'
import { useMutation } from '@tanstack/solid-query'
import { PencilSimple } from 'phosphor-solid'
import { createSignal } from 'solid-js'
import * as v from 'valibot'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { Button } from '@/components/ui/button'
import { updateIngredientOptions, updateIngredientSchema, type UpdateIngredientFormInput } from '@/features/ingredients/api/update'
import { getIngredientDefaultValues, IngredientForm } from '@/features/ingredients/components/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'
import { type Ingredient } from '@/types/ingredient'

interface EditIngredientProps {
  ingredient: Ingredient
}

const FormDialog = getFormDialog<UpdateIngredientFormInput>(getIngredientDefaultValues())

export const EditIngredient = (props: EditIngredientProps) => {
  const updateMutation = useMutation(() => updateIngredientOptions())
  const [open, setOpen] = createSignal(false)

  const form = useAppForm(() => {
    const initialValues: UpdateIngredientFormInput = {
      category: props.ingredient.category,
      countWeightG: props.ingredient.countWeightG,
      densityGPerMl: props.ingredient.densityGPerMl,
      id: props.ingredient.id,
      name: props.ingredient.name,
      parentId: props.ingredient.parentId ?? undefined,
      preferredUnitSlug: props.ingredient.preferredUnitSlug,
    }

    return {
      defaultValues: initialValues,
      onSubmit: async (data) => {
        await updateMutation.mutateAsync(
          { data: v.parse(updateIngredientSchema, data.value) },
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
        onDynamic: updateIngredientSchema,
      },
    }
  })

  return (
    <FormDialog
      form={form}
      open={open()}
      setOpen={setOpen}
      submitLabel="Mettre à jour"
      title="Modifier l'ingrédient"
      trigger={{ as: Button, children: <PencilSimple />, size: 'icon', variant: 'outline' }}
    >
      <IngredientForm form={form} />
    </FormDialog>
  )
}
