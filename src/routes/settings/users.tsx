import { PlusIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { useState } from 'react'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemGroup, ItemSeparator, ItemTitle } from '@/components/ui/item'
import { getUserListOptions } from '@/features/users/api/get-all'
import { AddUser } from '@/features/users/components/add-user'
import { DeleteUser } from '@/features/users/components/delete-user'

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  user: 'Utilisateur',
}

const UsersManagement = () => {
  const { data: users } = useSuspenseQuery(getUserListOptions())
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()
  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(query) || user.role.toLowerCase().includes(query))

  return (
    <ScreenLayout title="Utilisateurs" withGoBack>
      <div className="sticky top-0 z-10 flex items-center gap-4 bg-background px-4 pt-4 pb-2">
        <SearchInput search={search} setSearch={setSearch} />
        <AddUser>
          <Button size="icon-lg" variant="outline">
            <PlusIcon />
          </Button>
        </AddUser>
      </div>

      <div className="px-4">
        {filteredUsers.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            {search ? 'Aucun utilisateur trouvé pour cette recherche.' : 'Aucun utilisateur trouvé.'}
          </p>
        ) : (
          <ItemGroup>
            {filteredUsers.map((user, index) => (
              <React.Fragment key={user.id}>
                <Item className="flex-nowrap">
                  <ItemContent>
                    <ItemTitle>
                      <span className="text-nowrap text-ellipsis">{user.email}</span>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{roleLabels[user.role]}</Badge>
                    </ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <DeleteUser userEmail={user.email} userId={user.id} />
                  </ItemActions>
                </Item>
                {index !== filteredUsers.length - 1 && <ItemSeparator />}
              </React.Fragment>
            ))}
          </ItemGroup>
        )}
      </div>
    </ScreenLayout>
  )
}

const RouteComponent = () => <UsersManagement />

export const Route = createFileRoute('/settings/users')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(getUserListOptions()),
})
