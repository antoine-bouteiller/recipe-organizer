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
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import { getUserListOptions } from '@/features/users/api/get-all'
import { AddUser } from '@/features/users/components/add-user'
import { ApproveUser } from '@/features/users/components/approve-user'
import { BlockUser } from '@/features/users/components/block-user'
import { DeleteUser } from '@/features/users/components/delete-user'

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  user: 'Utilisateur',
}

const UserList = ({
  actions,
  emptyLabel,
  search,
  status,
}: {
  actions: (userItem: { email: string; id: string }) => React.ReactNode
  emptyLabel: string
  search: string
  status: 'active' | 'pending' | 'blocked'
}) => {
  const { data: users } = useSuspenseQuery(getUserListOptions(status))
  const query = search.trim().toLowerCase()
  const filteredUsers = users.filter((userItem) => userItem.email.toLowerCase().includes(query) || userItem.role.toLowerCase().includes(query))

  if (filteredUsers.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">{search ? 'Aucun utilisateur trouvé pour cette recherche.' : emptyLabel}</p>
  }

  return (
    <ItemGroup>
      {filteredUsers.map((userItem, index) => (
        <React.Fragment key={userItem.id}>
          <Item className="flex-nowrap">
            <ItemContent>
              <ItemTitle>
                <span className="text-nowrap text-ellipsis">{userItem.email}</span>
                <Badge variant={userItem.role === 'admin' ? 'default' : 'secondary'}>{roleLabels[userItem.role]}</Badge>
              </ItemTitle>
            </ItemContent>
            <ItemActions>{actions(userItem)}</ItemActions>
          </Item>
          {index !== filteredUsers.length - 1 && <ItemSeparator />}
        </React.Fragment>
      ))}
    </ItemGroup>
  )
}

const UsersManagement = () => {
  const [search, setSearch] = useState('')

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
        <Tabs defaultValue="active">
          <TabsList className="mb-4 w-full">
            <TabsTab value="active">Actifs</TabsTab>
            <TabsTab value="pending">En attente</TabsTab>
            <TabsTab value="blocked">Bloqués</TabsTab>
          </TabsList>

          <TabsPanel value="active">
            <React.Suspense fallback={null}>
              <UserList
                actions={(userItem) => <DeleteUser userEmail={userItem.email} userId={userItem.id} />}
                emptyLabel="Aucun utilisateur actif."
                search={search}
                status="active"
              />
            </React.Suspense>
          </TabsPanel>

          <TabsPanel value="pending">
            <React.Suspense fallback={null}>
              <UserList
                actions={(userItem) => (
                  <>
                    <ApproveUser userId={userItem.id} />
                    <BlockUser userEmail={userItem.email} userId={userItem.id} />
                  </>
                )}
                emptyLabel="Aucun utilisateur en attente."
                search={search}
                status="pending"
              />
            </React.Suspense>
          </TabsPanel>

          <TabsPanel value="blocked">
            <React.Suspense fallback={null}>
              <UserList actions={() => null} emptyLabel="Aucun utilisateur bloqué." search={search} status="blocked" />
            </React.Suspense>
          </TabsPanel>
        </Tabs>
      </div>
    </ScreenLayout>
  )
}

const RouteComponent = () => <UsersManagement />

export const Route = createFileRoute('/settings/users')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(getUserListOptions('active')),
})
