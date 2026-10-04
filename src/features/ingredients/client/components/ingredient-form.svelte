<script module lang="ts">
  import type { IngredientFormInput } from '@/features/ingredients/schemas'

  export const getIngredientDefaultValues = (defaultName?: string): IngredientFormInput => ({
    category: undefined,
    countWeightG: null,
    densityGPerMl: null,
    name: defaultName ?? '',
    preferredUnitSlug: null,
  })
</script>

<script lang="ts">
  import { ingredientsCategoryOptions } from '@/components/ingredient-categories'
  import ComboboxField from '@/components/ui/forms/combobox-field/combobox-field.svelte'
  import NumberField from '@/components/ui/forms/number-field/number-field.svelte'
  import SelectField from '@/components/ui/forms/select-field/select-field.svelte'
  import TextField from '@/components/ui/forms/text-field/text-field.svelte'
  import { ingredientCategory } from '@/features/ingredients/categories'
  import { useIngredientOptions } from '@/features/ingredients/client/hooks/use-ingredient-options.svelte'
  import { unitOptions } from '@/utils/units'

  interface IngredientFormProps {
    data: IngredientFormInput
    setData: <TKey extends keyof IngredientFormInput>(key: TKey, value: IngredientFormInput[TKey]) => void
    pending: boolean
  }
  const { data, setData, pending }: IngredientFormProps = $props()
  const ingredientOptions = useIngredientOptions(() => ({ allowEmpty: true }))
  const preferredUnitOptions = [{ label: 'Aucune', value: '' }, ...unitOptions]
</script>

<TextField
  name="name"
  value={data.name ?? ''}
  onChange={(value) => setData('name', value)}
  disabled={pending}
  label="Nom de l'ingrédient"
  placeholder="Ex: Tomate"
/>
<SelectField
  name="category"
  value={data.category}
  onChange={(value) =>
    setData(
      'category',
      ingredientCategory.find((category) => category === value)
    )}
  disabled={pending}
  items={ingredientsCategoryOptions}
  label="Catégorie"
/>
<ComboboxField
  name="parentId"
  value={data.parentId}
  onChange={(value) => setData('parentId', value)}
  disabled={pending}
  label="Ingrédient parent"
  options={ingredientOptions.current}
/>
<NumberField
  name="densityGPerMl"
  value={data.densityGPerMl ?? undefined}
  onChange={(value) => setData('densityGPerMl', value ?? null)}
  disabled={pending}
  label="Densité (g/ml)"
  min={0}
  placeholder="Ex: 0.55"
/>
<NumberField
  name="countWeightG"
  value={data.countWeightG ?? undefined}
  onChange={(value) => setData('countWeightG', value ?? null)}
  disabled={pending}
  label="Poids unitaire (g)"
  min={0}
  placeholder="Ex: 50"
/>
<SelectField
  name="preferredUnitSlug"
  value={data.preferredUnitSlug}
  onChange={(value) => setData('preferredUnitSlug', unitOptions.find((option) => option.value === value)?.value ?? null)}
  disabled={pending}
  items={preferredUnitOptions}
  label="Unité préférée (liste de courses)"
/>
