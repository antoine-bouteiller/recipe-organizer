import { withFieldGroup } from '@/hooks/use-app-form'
import { createFieldMap, useStore } from '@tanstack/react-form'
import type { IngredientFormInput } from './api/create'

export { ingredientSchema } from './api/create'

export const ingredientDefaultValues: IngredientFormInput = {
  name: '',
  category: 'supermarket',
}

export const ingredientFormFields = createFieldMap(ingredientDefaultValues)

export const IngredientForm = withFieldGroup({
  defaultValues: ingredientDefaultValues,
  render: function Render({ group }) {
    const { AppField } = group

    const isSubmitting = useStore(group.form.store, (state) => state.isSubmitting)

    return (
      <>
        <AppField name="name">
          {({ TextField }) => (
            <TextField
              label="Nom de l'ingrédient"
              placeholder="Ex: Tomate"
              disabled={isSubmitting}
            />
          )}
        </AppField>

        <AppField name="category">
          {({ TextField }) => (
            <TextField label="Catégorie" placeholder="Ex: supermarket" disabled={isSubmitting} />
          )}
        </AppField>
      </>
    )
  },
})
