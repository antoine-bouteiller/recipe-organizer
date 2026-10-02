import { revalidateLogic } from '@tanstack/react-form'
import { useState } from 'react'

import { useAppForm } from '@/design-system/hooks/use-app-form'
import { Button } from '@/design-system/ui/actions/button/button'
import { PencilSimpleIcon } from '@/design-system/ui/data-display/icons'
import { getFormDialog } from '@/design-system/ui/overlays/form-dialog/form-dialog'
import { getIngredientDefaultValues, IngredientForm } from '@/features/ingredients/client/components/ingredient-form'
import { ingredientSchema, updateIngredientSchema } from '@/features/ingredients/schemas'
import type { UpdateIngredientFormInput } from '@/features/ingredients/schemas'
import { usePageAction } from '@/lib/client/page-action'
import type { Ingredient } from '@/types/ingredient'

interface EditIngredientProps {
  ingredient: Ingredient
}

const FormDialog = getFormDialog(getIngredientDefaultValues())

export const EditIngredient = ({ ingredient }: EditIngredientProps) => {
  const runPageAction = usePageAction()
  const [open, setOpen] = useState(false)

  const initialValues: UpdateIngredientFormInput = {
    category: ingredient.category,
    countWeightG: ingredient.countWeightG,
    densityGPerMl: ingredient.densityGPerMl,
    id: ingredient.id,
    name: ingredient.name,
    parentId: ingredient.parentId ?? undefined,
    preferredUnitSlug: ingredient.preferredUnitSlug,
  }

  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: async (data) => {
      if (
        await runPageAction(
          '/settings/ingredients?update',
          { data: updateIngredientSchema.parse(data.value) },
          `Erreur lors de la mise à jour de l'ingrédient ${data.value.name}`
        )
      ) {
        form.reset()
        setOpen(false)
      }
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
      renderTrigger={(props) => (
        <Button {...props} size="icon" variant="outline">
          <PencilSimpleIcon />
        </Button>
      )}
    >
      <IngredientForm form={form} />
    </FormDialog>
  )
}
