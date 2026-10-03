import { useForm } from '@void/react'
import { useState, useEffect, startTransition } from 'react'

import { Button } from '@/components/ui/actions/button/button'
import { PencilSimpleIcon } from '@/components/ui/data-display/icons'
import { FormDialog } from '@/components/ui/overlays/form-dialog/form-dialog'
import { IngredientForm } from '@/features/ingredients/client/components/ingredient-form'
import { useFormActionError } from '@/lib/client/page-action'
import type { Ingredient } from '@/types/ingredient'

interface EditIngredientProps {
  ingredient: Ingredient
}

export const EditIngredient = ({ ingredient }: EditIngredientProps) => {
  const [open, setOpen] = useState(false)

  const initialValues = {
    category: ingredient.category,
    countWeightG: ingredient.countWeightG,
    densityGPerMl: ingredient.densityGPerMl,
    id: ingredient.id,
    name: ingredient.name,
    parentId: ingredient.parentId ?? undefined,
    preferredUnitSlug: ingredient.preferredUnitSlug,
  }

  const form = useForm('/settings/ingredients?update', initialValues)
  useFormActionError(form.error, `Erreur lors de la mise à jour de l'ingrédient ${form.data.name}`)
  useEffect(() => {
    if (form.wasSuccessful) {
      queueMicrotask(() => setOpen(false))
    }
  }, [form.wasSuccessful])

  return (
    <FormDialog
      errors={form.errors}
      pending={form.pending}
      onSubmit={(event) => {
        event.preventDefault()
        startTransition(() => form.post(new FormData()))
      }}
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
      <IngredientForm data={form.data} setData={form.setData} pending={form.pending} />
    </FormDialog>
  )
}
