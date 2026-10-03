import { useRouter } from '@void/react'
import { useState } from 'react'
import { fetch } from 'void/client'

import { Button } from '@/components/ui/actions/button/button'
import { PlusIcon } from '@/components/ui/data-display/icons'
import type { DialogProps } from '@/components/ui/overlays/dialog/dialog'
import { FormDialog } from '@/components/ui/overlays/form-dialog/form-dialog'
import { getIngredientDefaultValues, IngredientForm } from '@/features/ingredients/client/components/ingredient-form'
import type { IngredientFormInput } from '@/features/ingredients/schemas'
import { alertError } from '@/lib/client/alert-error'
import { readResponse } from '@/lib/client/api-client'

interface AddIngredientProps {
  defaultValue?: string
  renderTrigger: DialogProps['renderTrigger']
}

export const AddIngredient = ({ defaultValue, renderTrigger }: AddIngredientProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const [ingredientData, setIngredientData] = useState(() => getIngredientDefaultValues(defaultValue))
  const [pending, setPending] = useState(false)
  const setData = <TKey extends keyof IngredientFormInput>(key: TKey, value: IngredientFormInput[TKey]) =>
    setIngredientData((previous) => ({ ...previous, [key]: value }))
  const submit = async () => {
    setPending(true)
    try {
      await readResponse(fetch('/api/ingredients', { body: ingredientData, method: 'POST' }))
      await router.refresh()
      setIngredientData(getIngredientDefaultValues(defaultValue))
      setOpen(false)
    } catch (error) {
      alertError(`Erreur lors de la création de l'ingrédient ${ingredientData.name ?? ''}`, error)
    }
    setPending(false)
  }

  return (
    <FormDialog
      pending={pending}
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
      open={open}
      setOpen={setOpen}
      submitLabel="Ajouter"
      title="Ajouter un ingrédient"
      renderTrigger={renderTrigger}
    >
      <IngredientForm data={ingredientData} setData={setData} pending={pending} />
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
