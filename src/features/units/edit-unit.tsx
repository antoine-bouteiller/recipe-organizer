import { getFormDialog } from '@/components/dialogs/form-dialog'
import { Button } from '@/components/ui/button'
import { type Unit } from '@/features/units/api/get-all'
import {
  updateUnitOptions,
  updateUnitSchema,
  type UpdateUnitFormInput,
} from '@/features/units/api/update'
import { UnitForm, unitDefaultValues, unitFormFields } from '@/features/units/unit-form'
import { useAppForm } from '@/hooks/use-app-form'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'

interface EditUnitProps {
  unit: Unit
}

const FormDialog = getFormDialog(unitDefaultValues)

export const EditUnit = ({ unit }: EditUnitProps) => {
  const updateMutation = useMutation(updateUnitOptions())

  const initialValues: UpdateUnitFormInput = {
    id: unit.id,
    name: unit.name,
    symbol: unit.symbol,
    parentId: unit.parentId ?? undefined,
    factor: unit.factor ?? undefined,
  }

  const form = useAppForm({
    validators: {
      onDynamic: updateUnitSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync({
        data: updateUnitSchema.parse(value),
      })
    },
  })

  return (
    <FormDialog
      title="Modifier l'unité"
      submitLabel="Mettre à jour"
      form={form}
      trigger={
        <Button variant="outline" size="icon">
          <PencilSimpleIcon />
        </Button>
      }
    >
      <UnitForm form={form} fields={unitFormFields} unit={unit} />
    </FormDialog>
  )
}
