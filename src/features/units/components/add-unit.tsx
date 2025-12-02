import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { type JSX, useState } from 'react'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { createUnitOptions, type UnitFormInput, unitSchema } from '@/features/units/api/create'
import { unitDefaultValues, UnitForm, unitFormFields } from '@/features/units/components/unit-form'
import { useAppForm } from '@/hooks/use-app-form'

interface AddUnitProps {
  children: JSX.Element
  defaultValue?: string
}

const FormDialog = getFormDialog(unitDefaultValues)

export const AddUnit = ({ children, defaultValue }: AddUnitProps) => {
  const createMutation = useMutation(createUnitOptions())
  const [open, setOpen] = useState(false)

  const form = useAppForm({
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
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: unitSchema,
    },
  })

  return (
    <FormDialog form={form} open={open} setOpen={setOpen} submitLabel="Ajouter" title="Ajouter une unité" trigger={children}>
      <UnitForm fields={unitFormFields} form={form} />
    </FormDialog>
  )
}
