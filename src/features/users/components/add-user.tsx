import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState, type JSX } from 'react'
import * as v from 'valibot'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { createUserOptions, userSchema } from '@/features/users/api/create'
import { userDefaultValues, UserForm } from '@/features/users/components/user-form'
import { useAppForm } from '@/hooks/use-app-form'

interface AddUserProps {
  children: JSX.Element
}

const FormDialog = getFormDialog(userDefaultValues)

export const AddUser = ({ children }: AddUserProps) => {
  const createMutation = useMutation(createUserOptions())
  const [open, setOpen] = useState(false)

  const form = useAppForm({
    defaultValues: userDefaultValues,
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(
        {
          data: v.parse(userSchema, value),
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
      onDynamic: userSchema,
    },
  })

  return (
    <FormDialog form={form} open={open} setOpen={setOpen} submitLabel="Ajouter" title="Ajouter un utilisateur" trigger={children}>
      <UserForm form={form} />
    </FormDialog>
  )
}
