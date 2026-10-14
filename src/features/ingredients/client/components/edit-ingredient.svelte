<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query'
  import { untrack } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'
  import { PencilSimpleIcon } from '@/components/ui/data-display/icons'
  import FormDialog from '@/components/ui/overlays/form-dialog/form-dialog.svelte'
  import { updateIngredientMutation } from '@/features/ingredients/client/api/update'
  import type { IngredientFormInput } from '@/features/ingredients/schemas'
  import { alertError } from '@/lib/client/alert-error'
  import { createForm } from '@/lib/client/form.svelte'
  import type { Ingredient } from '@/types/ingredient'

  import IngredientForm from './ingredient-form.svelte'

  const { ingredient }: { ingredient: Ingredient } = $props()
  let open = $state(false)
  const toFormValues = (source: Ingredient): IngredientFormInput => ({
    category: source.category,
    countWeightG: source.countWeightG,
    densityGPerMl: source.densityGPerMl,
    name: source.name,
    parentId: source.parentId ?? undefined,
    preferredUnitSlug: source.preferredUnitSlug,
  })
  const form = createForm(untrack(() => toFormValues(ingredient)))
  const mutation = createMutation(() => updateIngredientMutation(ingredient.id))
  const setData = <TKey extends keyof IngredientFormInput>(key: TKey, value: IngredientFormInput[TKey]) => {
    Object.assign(form.data, { [key]: value })
  }
  // A refreshed row supplies the next edit, without replacing an open invalid draft.
  $effect(() => {
    const next = toFormValues(ingredient)
    untrack(() => {
      if (!open && !form.pending) {
        form.reset(next)
      }
    })
  })
  const submit = async (event: SubmitEvent) => {
    event.preventDefault()
    if (form.pending) {
      return
    }
    try {
      if (await form.submit((body) => mutation.mutateAsync(body))) {
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
