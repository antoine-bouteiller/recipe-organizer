import { PencilSimpleIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { Button } from '@/components/ui/button'
import { type Unit } from '@/features/units/api/get-all'
import { type UpdateUnitFormInput, updateUnitOptions, updateUnitSchema } from '@/features/units/api/update'
import { unitDefaultValues, UnitForm, unitFormFields } from '@/features/units/components/unit-form'
import { useAppForm } from '@/hooks/use-app-form'

interface EditUnitProps {
  unit: Unit
}

const FormDialog = getFormDialog(unitDefaultValues)

export const EditUnit = ({ unit }: EditUnitProps) => {
  const updateMutation = useMutation(updateUnitOptions())
  const [open, setOpen] = useState(false)

  const initialValues: UpdateUnitFormInput = {
    factor: unit.factor ?? undefined,
    id: unit.id,
    name: unit.name,
    parentId: unit.parentId ?? undefined,
  }

  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync(
        {
          data: updateUnitSchema.assert(value),
        },
        {
          onSuccess: () => {
            form.reset()
            setOpen(false)
          },
        }
      )
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: updateUnitSchema,
    },
  })

  return (
    <FormDialog
      form={form}
      open={open}
      setOpen={setOpen}
      submitLabel="Mettre à jour"
      title="Modifier l'unité"
      trigger={
        <Button size="icon" variant="outline">
          <PencilSimpleIcon />
        </Button>
      }
    >
      <UnitForm fields={unitFormFields} form={form} unit={unit} />
    </FormDialog>
  )
}
