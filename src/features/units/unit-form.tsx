import type { Unit } from "@/features/units/api/get-all";
import { withFieldGroup } from "@/hooks/use-app-form";
import { createFieldMap, useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { z } from "zod";
import { getUnitsListOptions } from "./api/get-all";

// Form-specific validation schema (accepts string for parentId from combobox)
export const unitFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  symbol: z.string().min(1, "Le symbole est requis"),
  parentId: z.string().nullish(),
  factor: z.number().positive("Le facteur doit être positif").nullish(),
});

export interface UnitFormInput {
  name: string;
  symbol: string;
  parentId?: string | null;
  factor?: number | null;
}

export const unitDefaultValues: UnitFormInput = {
  name: "",
  symbol: "",
  parentId: undefined,
  factor: undefined,
};

export const unitFormFields = createFieldMap(unitDefaultValues);

interface UnitFormProps extends Record<string, unknown> {
  unit?: Unit;
}

export const UnitForm = withFieldGroup({
  defaultValues: unitDefaultValues,
  props: {} as UnitFormProps,
  render: function Render({ group, unit }) {
    const { data: units } = useQuery(getUnitsListOptions());
    const { AppField } = group;

    const isSubmitting = useStore(
      group.form.store,
      (state) => state.isSubmitting,
    );

    const availableParentUnits = useMemo(() => {
      const filtered = units?.filter((u) => u.id !== unit?.id) ?? [];
      return [
        { label: "Aucune", value: "" },
        ...filtered.map((u) => ({
          label: `${u.name} (${u.symbol})`,
          value: u.id.toString(),
        })),
      ];
    }, [units, unit?.id]);

    return (
      <>
        <AppField name="name">
          {({ TextField }) => (
            <TextField
              label="Nom de l'unité"
              placeholder="Ex: Gramme"
              disabled={isSubmitting}
            />
          )}
        </AppField>

        <AppField name="symbol">
          {({ TextField }) => (
            <TextField
              label="Symbole"
              placeholder="Ex: g"
              disabled={isSubmitting}
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

              {state.value && state.value !== "" && (
                <AppField name="factor">
                  {({ NumberField }) => (
                    <NumberField
                      label="Facteur de conversion (combien de cette unité dans l'unité parente)"
                      placeholder="Ex: 1000 (pour 1000 g dans 1 kg)"
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
    );
  },
});
