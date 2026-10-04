<script module lang="ts">
  import type { DialogProps } from '@/components/ui/overlays/dialog/dialog.svelte'

  import AddIngredientOption from './add-ingredient-option.svelte'

  export interface AddIngredientProps {
    defaultValue?: string
    renderTrigger: DialogProps['renderTrigger']
  }

  export { renderAddIngredientOption }
</script>

<script lang="ts">
  import { useRouter } from '@void/svelte'
  import { untrack } from 'svelte'
  import { fetch } from 'void/client'

  import FormDialog from '@/components/ui/overlays/form-dialog/form-dialog.svelte'
  import type { IngredientFormInput } from '@/features/ingredients/schemas'
  import { alertError } from '@/lib/client/alert-error'
  import { readResponse } from '@/lib/client/api-client'

  import IngredientForm, { getIngredientDefaultValues } from './ingredient-form.svelte'

  const { defaultValue, renderTrigger }: AddIngredientProps = $props()
  const router = useRouter()
  let open = $state(false)
  let ingredientData = $state(untrack(() => getIngredientDefaultValues(defaultValue)))
  let pending = $state(false)
  const setData = <TKey extends keyof IngredientFormInput>(key: TKey, value: IngredientFormInput[TKey]) => {
    ingredientData[key] = value
  }
  const submit = async (event: SubmitEvent) => {
    event.preventDefault()
    if (pending) {
      return
    }
    pending = true
    try {
      await readResponse(fetch('/api/ingredients', { body: ingredientData, method: 'POST' }))
      await router.refresh()
      ingredientData = getIngredientDefaultValues(defaultValue)
      open = false
    } catch (error) {
      alertError(`Erreur lors de la création de l'ingrédient ${ingredientData.name ?? ''}`, error)
    } finally {
      pending = false
    }
  }
</script>

{#snippet renderAddIngredientOption(inputValue: string)}<AddIngredientOption {inputValue} />{/snippet}

<FormDialog {pending} onsubmit={submit} {open} setOpen={(next) => (open = next)} submitLabel="Ajouter" title="Ajouter un ingrédient" {renderTrigger}>
  <IngredientForm data={ingredientData} {setData} {pending} />
</FormDialog>
