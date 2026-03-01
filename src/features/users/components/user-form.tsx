import { useStore } from '@tanstack/react-form'

import { withForm } from '@/hooks/use-app-form'

import type { UserFormInput } from '../api/create'

const roleOptions = [
  { label: 'Utilisateur', value: 'user' },
  { label: 'Administrateur', value: 'admin' },
]

export const userDefaultValues: UserFormInput = {
  email: '',
  role: 'user',
}

export const UserForm = withForm({
  defaultValues: userDefaultValues,
  render: function Render({ form }) {
    const { AppField } = form
    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    return (
      <>
        <AppField name="email">{({ TextField }) => <TextField disabled={isSubmitting} label="Email" placeholder="Ex: user@example.com" />}</AppField>

        <AppField name="role">{({ SelectField }) => <SelectField disabled={isSubmitting} items={roleOptions} label="Rôle" />}</AppField>
      </>
    )
  },
})
