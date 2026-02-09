import { createFieldMap, useStore } from '@tanstack/react-form'

import type { Unit } from '@/features/units/api/get-all'

import { withForm } from '@/hooks/use-app-form'
import { useUnitOptions } from '@/hooks/use-options'

import type { UnitFormInput } from '../api/create'

export const unitDefaultValues: UnitFormInput = {
  factor: undefined,
  name: '',
  parentId: undefined,
}

export const unitFormFields = createFieldMap(unitDefaultValues)

interface UnitFormProps extends Record<string, unknown> {
  unit?: Unit
}

export const UnitForm = withForm({
  defaultValues: unitDefaultValues,
  props: {} as UnitFormProps,
  render: function Render({ form, unit }) {
    const { AppField } = form

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    const availableParentUnits = useUnitOptions({
      allowEmpty: true,
      filter: (u) => u.id !== unit?.id,
    })

    return (
      <>
        <AppField name="name">{({ TextField }) => <TextField disabled={isSubmitting} label="Nom de l'unité" />}</AppField>

        <AppField name="parentId">
          {({ ComboboxField, state }) => (
            <>
              <ComboboxField
                disabled={isSubmitting}
                label="Unité parente (optionnel)"
                nested
                options={availableParentUnits}
                placeholder="Sélectionner une unité parente"
                searchPlaceholder="Rechercher une unité"
              />

              {state.value && (
                <AppField name="factor">
                  {({ NumberField }) => (
                    <NumberField
                      disabled={isSubmitting}
                      label="Facteur de conversion (combien de cette unité dans l'unité parente)"
                      min={0.01}
                      placeholder="Ex: 1000 (pour 1000 g dans 1 kg)"
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
