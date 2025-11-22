import { withForm } from '@/hooks/use-app-form'
import { useStore } from '@tanstack/react-form'
import type { IngredientFormInput } from '../api/create'

export { ingredientSchema } from '../api/create'

export const ingredientDefaultValues: IngredientFormInput = {
  name: '',
  category: 'supermarket',
}

export const IngredientForm = withForm({
  defaultValues: ingredientDefaultValues,
  render: function Render({ form }) {
    const { AppField } = form

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

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
