import type { Ingredient } from '@/types/ingredient'
import { withFieldGroup } from '@/hooks/use-app-form'
import { createFieldMap, useStore } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { z } from 'zod'
import { getIngredientListOptions } from './api/get-all'

export const ingredientFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  category: z.string().min(1, 'La catégorie est requise'),
  parentId: z.string().nullish(),
  factor: z.number().positive('Le facteur doit être positif').nullish(),
})

export interface IngredientFormInput {
  name: string
  category: string
  parentId?: string | null
  factor?: number | null
}

export const ingredientDefaultValues: IngredientFormInput = {
  name: '',
  category: 'supermarket',
  parentId: undefined,
  factor: undefined,
}

export const ingredientFormFields = createFieldMap(ingredientDefaultValues)

interface IngredientFormProps extends Record<string, unknown> {
  ingredient?: Ingredient
}

export const IngredientForm = withFieldGroup({
  defaultValues: ingredientDefaultValues,
  props: {} as IngredientFormProps,
  render: function Render({ group, ingredient }) {
    const { data: ingredients } = useQuery(getIngredientListOptions())
    const { AppField } = group

    const isSubmitting = useStore(group.form.store, (state) => state.isSubmitting)

    const availableParentIngredients = useMemo(() => {
      const filtered = ingredients?.filter((i) => i.id !== ingredient?.id) ?? []
      return [
        { label: 'Aucun', value: '' },
        ...filtered.map((i) => ({
          label: i.name,
          value: i.id.toString(),
        })),
      ]
    }, [ingredients, ingredient?.id])

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

        <AppField name="parentId">
          {({ ComboboxField, state }) => (
            <>
              <ComboboxField
                label="Ingrédient parent (optionnel)"
                options={availableParentIngredients}
                disabled={isSubmitting}
                placeholder="Sélectionner un ingrédient parent"
                searchPlaceholder="Rechercher un ingrédient"
                noResultsLabel="Aucun ingrédient trouvé"
              />

              {state.value && state.value !== '' && (
                <AppField name="factor">
                  {({ NumberField }) => (
                    <NumberField
                      label="Facteur de conversion (combien de cette unité dans l'ingrédient parent)"
                      placeholder="Ex: 1 (pour 1 jaune dans 1 oeuf)"
                      min={0.01}
                      disabled={isSubmitting}
                      decimalScale={2}
                    />
                  )}
                </AppField>
              )}
            </>
          )}
        </AppField>
      </>
    )
  },
})
