import { useForm } from '@void/react'
import React, { useState, useEffect, startTransition } from 'react'

import { Button } from '@/components/ui/actions/button/button'
import { Badge } from '@/components/ui/data-display/badge/badge'
import { PlusIcon } from '@/components/ui/data-display/icons'
import { Item, ItemGroup, ItemSeparator } from '@/components/ui/data-display/item/item'
import { SearchInput } from '@/components/ui/forms/search-input/search-input'
import { SelectField } from '@/components/ui/forms/select-field/select-field'
import { TextField } from '@/components/ui/forms/text-field/text-field'
import { Tabs } from '@/components/ui/navigation/tabs/tabs'
import { FormDialog } from '@/components/ui/overlays/form-dialog/form-dialog'
import { ApproveUser } from '@/features/users/client/components/approve-user'
import { BlockUser } from '@/features/users/client/components/block-user'
import type { UserFormInput } from '@/features/users/schemas'
import { useFormActionError } from '@/lib/client/page-action'
import type { User } from '@/types/user'

import * as styles from './users-management.css'

const USER_TABS = ['active', 'pending', 'blocked'] as const
const userDefaultValues: Required<UserFormInput> = {
  email: '',
  role: 'user',
}
const roleOptions = [
  { label: 'Utilisateur', value: 'user' },
  { label: 'Administrateur', value: 'admin' },
]
const roleLabels = new Map([
  ['admin', 'Admin'],
  ['user', 'Utilisateur'],
])
type UserStatus = (typeof USER_TABS)[number]
const USER_TAB_LABELS = {
  active: { empty: 'Aucun utilisateur actif.', label: 'Actifs' },
  blocked: { empty: 'Aucun utilisateur bloqué.', label: 'Bloqués' },
  pending: { empty: 'Aucun utilisateur en attente.', label: 'En attente' },
} satisfies Record<UserStatus, { empty: string; label: string }>

const UserList = ({ emptyLabel, search, status, users }: { emptyLabel: string; search: string; status: UserStatus; users: readonly User[] }) => {
  const query = search.trim().toLowerCase()
  const filteredUsers = users.filter((userItem) => userItem.email.toLowerCase().includes(query) || userItem.role.toLowerCase().includes(query))
  if (filteredUsers.length === 0) {
    return <p className={styles.emptyState}>{search ? 'Aucun utilisateur trouvé pour cette recherche.' : emptyLabel}</p>
  }
  const showBlockButton = status === 'active' || status === 'pending'
  return (
    <ItemGroup>
      {filteredUsers.map((userItem, index) => (
        <React.Fragment key={userItem.id}>
          <Item
            layout="row"
            actions={
              <>
                {(status === 'blocked' || status === 'pending') && <ApproveUser userId={userItem.id} />}
                {showBlockButton && <BlockUser userEmail={userItem.email} userId={userItem.id} />}
              </>
            }
            title={
              <>
                <span className={styles.userEmail}>{userItem.email}</span>
                <Badge variant={userItem.role === 'admin' ? 'default' : 'secondary'}>{roleLabels.get(userItem.role)}</Badge>
              </>
            }
          />
          {index !== filteredUsers.length - 1 && <ItemSeparator />}
        </React.Fragment>
      ))}
    </ItemGroup>
  )
}

export const UsersManagement = ({ users }: { users: Record<UserStatus, readonly User[]> }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const form = useForm('/settings/users?create', userDefaultValues)
  useFormActionError(form.error, `Erreur lors de la création de l'utilisateur ${form.data.email}`)
  const { wasSuccessful, setData } = form
  useEffect(() => {
    if (wasSuccessful) {
      queueMicrotask(() => {
        setData('email', '')
        setData('role', 'user')
        setOpen(false)
      })
    }
  }, [wasSuccessful, setData])

  return (
    <>
      <div className={styles.searchBar}>
        <SearchInput placeholder="Rechercher une recette, un ingrédient…" search={search} setSearch={setSearch} />
        <FormDialog
          errors={form.errors}
          pending={form.pending}
          onSubmit={(event) => {
            event.preventDefault()
            startTransition(() => form.post(new FormData()))
          }}
          open={open}
          setOpen={setOpen}
          submitLabel="Ajouter"
          title="Ajouter un utilisateur"
          renderTrigger={(props) => (
            <Button {...props} aria-label="Ajouter un utilisateur" size="icon-lg" variant="outline">
              <PlusIcon />
            </Button>
          )}
        >
          <TextField
            name="email"
            value={form.data.email}
            onChange={(value) => form.setData('email', value)}
            disabled={form.pending}
            label="Email"
            placeholder="Ex: user@example.com"
          />
          <SelectField
            name="role"
            value={form.data.role}
            onChange={(value) => {
              if (value === 'admin' || value === 'user') {
                form.setData('role', value)
              }
            }}
            disabled={form.pending}
            items={roleOptions}
            label="Rôle"
          />
        </FormDialog>
      </div>
      <div className={styles.tabs}>
        <Tabs
          items={USER_TABS.map((status) => ({
            content: (
              <div className={styles.panel}>
                <UserList emptyLabel={USER_TAB_LABELS[status].empty} search={search} status={status} users={users[status]} />
              </div>
            ),
            label: USER_TAB_LABELS[status].label,
            value: status,
          }))}
        />
      </div>
    </>
  )
}
