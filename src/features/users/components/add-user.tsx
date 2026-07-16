import { revalidateLogic } from '@tanstack/solid-form'
import { useMutation } from '@tanstack/solid-query'
import { createSignal } from 'solid-js'
import * as v from 'valibot'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { type TriggerRender } from '@/components/ui/dialog'
import { createUserOptions, userSchema } from '@/features/users/api/create'
import { userDefaultValues, UserForm } from '@/features/users/components/user-form'
import { useAppForm } from '@/hooks/use-app-form'

interface AddUserProps {
  trigger: TriggerRender
}

const FormDialog = getFormDialog(userDefaultValues)

export const AddUser = (props: AddUserProps) => {
  const createMutation = useMutation(() => createUserOptions())
  const [open, setOpen] = createSignal(false)

  const form = useAppForm(() => ({
    defaultValues: userDefaultValues,
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(
        { data: v.parse(userSchema, value) },
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
  }))

  return (
    <FormDialog form={form} open={open()} setOpen={setOpen} submitLabel="Ajouter" title="Ajouter un utilisateur" trigger={props.trigger}>
      <UserForm form={form} />
    </FormDialog>
  )
}
