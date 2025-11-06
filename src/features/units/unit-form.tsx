import { Button } from '@/components/ui/button'
import type { Unit } from '@/features/units/api/get-all'
import { withFieldGroup } from '@/hooks/use-app-form'
import { createFieldMap, useStore } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getUnitsListOptions } from './api/get-all'

export interface UnitFormInput {
  name: string
  symbol: string
  parentId: string | undefined
  factor: number | undefined
}

export const unitDefaultValues: UnitFormInput = {
  name: '',
  symbol: '',
  parentId: undefined,
  factor: undefined,
}

export const unitFormFields = createFieldMap(unitDefaultValues)

interface UnitFormProps extends Record<string, unknown> {
  unit?: Unit
  onCancel: () => void
}

export const UnitForm = withFieldGroup({
  defaultValues: unitDefaultValues,
  props: {} as UnitFormProps,
  render: function Render({ group, unit, onCancel }) {
    const { data: units } = useQuery(getUnitsListOptions())
    const { AppField } = group

    const isSubmitting = useStore(group.form.store, (state) => state.isSubmitting)

    const availableParentUnits = useMemo(() => {
      const filtered = units?.filter((u) => u.id !== unit?.id) ?? []
      return [
        { label: 'Aucune', value: '' },
        ...filtered.map((u) => ({
          label: `${u.name} (${u.symbol})`,
          value: u.id.toString(),
        })),
      ]
    }, [units, unit?.id])

    return (
      <>
        <AppField name="name">
          {({ TextField }) => (
            <TextField
              label="Nom de l'unité"
              placeholder="Ex: Gramme"
              disabled={isSubmitting}
              minLength={2}
            />
          )}
        </AppField>

        <AppField name="symbol">
          {({ TextField }) => (
            <TextField
              label="Symbole"
              placeholder="Ex: g"
              disabled={isSubmitting}
              minLength={1}
            />
          )}
        </AppField>

        <AppField name="parentId">
          {({ ComboboxField, state }) => (
            <>
              <ComboboxField
                label="Unité parente (optionnel)"
                options={availableParentUnits}
                disabled={isSubmitting}
                placeholder="Sélectionner une unité parente"
                searchPlaceholder="Rechercher une unité"
                noResultsLabel="Aucune unité trouvée"
              />

              {state.value && state.value !== '' && (
                <AppField name="factor">
                  {({ NumberField }) => (
                    <NumberField
                      label="Facteur de conversion (combien de cette unité dans l'unité parente)"
                      placeholder="Ex: 1000 (pour 1000 g dans 1 kg)"
                      min={0.01}
                      step={0.01}
                      disabled={isSubmitting}
                      decimalScale={2}
                    />
                  )}
                </AppField>
              )}
            </>
          )}
        </AppField>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <group.form.AppForm>
            <group.form.FormSubmit label={unit ? 'Mettre à jour' : 'Ajouter'} />
          </group.form.AppForm>
        </div>
      </>
    )
  },
})
