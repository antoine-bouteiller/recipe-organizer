import { revalidateLogic } from '@tanstack/react-form'
import { useRouter } from '@void/react'
import { useState } from 'react'
import { fetch } from 'void/client'

import { Button } from '@/components/ui/actions/button/button'
import { PlusIcon } from '@/components/ui/data-display/icons'
import type { DialogProps } from '@/components/ui/overlays/dialog/dialog'
import { getFormDialog } from '@/components/ui/overlays/form-dialog/form-dialog'
import { getIngredientDefaultValues, IngredientForm } from '@/features/ingredients/client/components/ingredient-form'
import { ingredientSchema } from '@/features/ingredients/schemas'
import { useAppForm } from '@/hooks/use-app-form'
import { alertError } from '@/lib/client/alert-error'
import { readResponse } from '@/lib/client/api-client'

interface AddIngredientProps {
  defaultValue?: string
  renderTrigger: DialogProps['renderTrigger']
}

const FormDialog = getFormDialog(getIngredientDefaultValues())

export const AddIngredient = ({ defaultValue, renderTrigger }: AddIngredientProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const form = useAppForm({
    defaultValues: getIngredientDefaultValues(defaultValue),
    onSubmit: async ({ value }) => {
      try {
        await readResponse(fetch('/api/ingredients', { body: ingredientSchema.parse(value), method: 'POST' }))
      } catch (error) {
        alertError(`Erreur lors de la création de l'ingrédient ${value.name}`, error)
        return
      }
      await router.refresh()
      form.reset()
      setOpen(false)
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ingredientSchema,
    },
  })

  return (
    <FormDialog form={form} open={open} setOpen={setOpen} submitLabel="Ajouter" title="Ajouter un ingrédient" renderTrigger={renderTrigger}>
      <IngredientForm form={form} />
    </FormDialog>
  )
}

export const renderAddIngredientOption = (inputValue: string) => (
  <AddIngredient
    defaultValue={inputValue}
    key={inputValue}
    renderTrigger={(props) => (
      <Button {...props} size="sm" variant="list-action" width="full" align="start">
        <PlusIcon aria-hidden="true" size="sm" />
        Nouvel ingrédient: {inputValue}
      </Button>
    )}
  />
)
