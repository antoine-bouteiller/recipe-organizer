<script lang="ts">
  import { useForm } from '@void/svelte'
  import { untrack } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'
  import { PencilSimpleIcon } from '@/components/ui/data-display/icons'
  import FormDialog from '@/components/ui/overlays/form-dialog/form-dialog.svelte'
  import type { IngredientFormInput } from '@/features/ingredients/schemas'
  import { alertError } from '@/lib/client/alert-error'
  import { useFormActionError } from '@/lib/client/page-action.svelte'
  import type { Ingredient } from '@/types/ingredient'

  import IngredientForm from './ingredient-form.svelte'

  const { ingredient }: { ingredient: Ingredient } = $props()
  let open = $state(false)
  const initialValues = untrack(() => ({
    category: ingredient.category,
    countWeightG: ingredient.countWeightG,
    densityGPerMl: ingredient.densityGPerMl,
    id: ingredient.id,
    name: ingredient.name,
    parentId: ingredient.parentId ?? undefined,
    preferredUnitSlug: ingredient.preferredUnitSlug,
  }))
  const form = useForm('/settings/ingredients?update', initialValues)
  useFormActionError(() => form.error, "Erreur lors de la mise à jour de l'ingrédient")
  const setData = <TKey extends keyof IngredientFormInput>(key: TKey, value: IngredientFormInput[TKey]) => {
    Object.assign(form.data, { [key]: value })
  }
  // A refreshed row supplies the next edit, without replacing an open invalid draft.
  $effect(() => {
    const next = { ...ingredient, parentId: ingredient.parentId ?? undefined }
    untrack(() => {
      if (!open && !form.pending) {
        Object.assign(form.data, next)
        form.clearErrors()
        form.clearError()
      }
    })
  })
  const submit = async (event: SubmitEvent) => {
    event.preventDefault()
    if (form.pending) {
      return
    }
    try {
      await form.post({ preserveState: true })
      if (form.wasSuccessful) {
        open = false
      }
    } catch (error) {
      alertError(`Erreur lors de la mise à jour de l'ingrédient ${form.data.name}`, error)
    }
  }
</script>

<FormDialog
  errors={form.errors}
  pending={form.pending}
  onsubmit={submit}
  {open}
  setOpen={(next) => (open = next)}
  submitLabel="Mettre à jour"
  title="Modifier l'ingrédient"
>
  {#snippet renderTrigger(props)}<Button {...props} size="icon" variant="outline"><PencilSimpleIcon /></Button>{/snippet}
  <IngredientForm data={form.data} {setData} pending={form.pending} />
</FormDialog>
