import { getIngredientDefaultValues, IngredientForm } from '@client/features/ingredients/components/ingredient-form'
import { usePageAction } from '@client/lib/page-action'
import type { Ingredient } from '@client/types/ingredient'
import { Button } from '@recipe-organizer/design-system/button'
import { getFormDialog } from '@recipe-organizer/design-system/form-dialog'
import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { PencilSimpleIcon } from '@recipe-organizer/design-system/icons'
import { ingredientSchema, updateIngredientSchema } from '@recipe-organizer/shared/ingredients/schemas'
import type { UpdateIngredientFormInput } from '@recipe-organizer/shared/ingredients/schemas'
import { revalidateLogic } from '@tanstack/react-form'
import { useState } from 'react'

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
