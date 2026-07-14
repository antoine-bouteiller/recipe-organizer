import { unitOptions } from '@schema'
import { useSelector } from '@tanstack/solid-store'

import { ingredientsCategoryOptions } from '@/components/ingredient-category'
import { useIngredientOptions } from '@/features/ingredients/hooks/use-ingredient-options'
import { withForm } from '@/hooks/use-app-form'

import { type IngredientFormInput } from '../api/create'

export const getIngredientDefaultValues = (defaultName?: string): IngredientFormInput => ({
  category: undefined,
  countWeightG: null,
  densityGPerMl: null,
  name: defaultName ?? '',
  preferredUnitSlug: null,
})

const preferredUnitOptions = [{ label: 'Aucune', value: '' }, ...unitOptions]

export const IngredientForm = withForm({
  defaultValues: getIngredientDefaultValues(),
  render: ({ form }) => {
    const { AppField } = form
    const ingredientOptions = useIngredientOptions({ allowEmpty: true })

    const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

    return (
      <>
        <AppField name="name">
          {({ TextField }) => <TextField disabled={isSubmitting} label="Nom de l'ingrédient" placeholder="Ex: Tomate" />}
        </AppField>

        <AppField name="category">
          {({ SelectField }) => <SelectField disabled={isSubmitting} items={ingredientsCategoryOptions} label="Catégorie" />}
        </AppField>
        <AppField name="parentId">
          {({ ComboboxField }) => <ComboboxField disabled={isSubmitting} label="Ingrédient parent" options={ingredientOptions} />}
        </AppField>
        <AppField name="densityGPerMl">
          {({ NumberField }) => <NumberField disabled={isSubmitting} label="Densité (g/ml)" min={0} placeholder="Ex: 0.55" />}
        </AppField>
        <AppField name="countWeightG">
          {({ NumberField }) => <NumberField disabled={isSubmitting} label="Poids unitaire (g)" min={0} placeholder="Ex: 50" />}
        </AppField>
        <AppField name="preferredUnitSlug">
          {({ SelectField }) => <SelectField disabled={isSubmitting} items={preferredUnitOptions} label="Unité préférée (liste de courses)" />}
        </AppField>
      </>
    )
  },
})
