import { useStore } from '@tanstack/react-form'

import { withForm } from '@/hooks/use-app-form'
import { useIngredientOptions } from '@/hooks/use-options'

import type { IngredientFormInput } from '../api/create'

import { ingredientsCategoryOptions } from '../utils/ingredient-category'

export const ingredientDefaultValues: IngredientFormInput = {
  category: undefined,
  name: '',
}

export const IngredientForm = withForm({
  defaultValues: ingredientDefaultValues,
  render: function Render({ form }) {
    const { AppField } = form
    const ingredientOptions = useIngredientOptions({ allowEmpty: true })

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

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
      </>
    )
  },
})
