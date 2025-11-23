import { getFormDialog } from '@/components/dialogs/form-dialog'
import { createUnitOptions, unitSchema, type UnitFormInput } from '@/features/units/api/create'
import { unitDefaultValues, UnitForm, unitFormFields } from '@/features/units/unit-form'
import { useAppForm } from '@/hooks/use-app-form'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState, type JSX } from 'react'

interface AddUnitProps {
  defaultValue?: string
  children: JSX.Element
}

const FormDialog = getFormDialog(unitDefaultValues)

export const AddUnit = ({ defaultValue, children }: AddUnitProps) => {
  const createMutation = useMutation(createUnitOptions())
  const [open, setOpen] = useState(false)

  const form = useAppForm({
    validators: {
      onDynamic: unitSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: {
      ...unitDefaultValues,
      name: defaultValue ?? unitDefaultValues.name,
    } as UnitFormInput,
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(
        {
          data: unitSchema.parse(value),
        },
        {
          onSuccess: () => {
            form.reset()
            setOpen(false)
          },
        }
      )
    },
  })

  return (
    <FormDialog
      form={form}
      submitLabel="Ajouter"
      trigger={children}
      title="Ajouter une unité"
      open={open}
      setOpen={setOpen}
    >
      <UnitForm form={form} fields={unitFormFields} />
    </FormDialog>
  )
}
