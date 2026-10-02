import { getIngredientDefaultValues, IngredientForm } from '@client/features/ingredients/components/ingredient-form'
import { alertError } from '@client/lib/alert-error'
import { readResponse } from '@client/lib/api-client'
import { Button } from '@recipe-organizer/design-system/button'
import type { DialogProps } from '@recipe-organizer/design-system/dialog'
import { getFormDialog } from '@recipe-organizer/design-system/form-dialog'
import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { PlusIcon } from '@recipe-organizer/design-system/icons'
import { ingredientSchema } from '@recipe-organizer/shared/ingredients/schemas'
import { revalidateLogic } from '@tanstack/react-form'
import { useRouter } from '@void/react'
import { useState } from 'react'
import { fetch } from 'void/client'

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
