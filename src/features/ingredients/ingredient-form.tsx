import type { Ingredient } from '@/types/ingredient'
import { withFieldGroup } from '@/hooks/use-app-form'
import { createFieldMap, useStore } from '@tanstack/react-form'

export { ingredientSchema } from './api/add-one'

export interface IngredientFormInput {
  name: string
  category: string
}

export const ingredientDefaultValues: IngredientFormInput = {
  name: '',
  category: 'supermarket',
}

export const ingredientFormFields = createFieldMap(ingredientDefaultValues)

interface IngredientFormProps extends Record<string, unknown> {
  ingredient?: Ingredient
}

export const IngredientForm = withFieldGroup({
  defaultValues: ingredientDefaultValues,
  props: {} as IngredientFormProps,
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
            <TextField
              label="Catégorie"
              placeholder="Ex: supermarket"
              disabled={isSubmitting}
            />
          )}
        </AppField>
      </>
    )
  },
})
