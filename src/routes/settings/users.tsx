import { PlusIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import React, { useState } from 'react'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Item, ItemGroup, ItemSeparator } from '@/components/ui/item'
import { SwipeTabs, SwipeTabsPanels, TabsList, TabsTab } from '@/components/ui/tabs'
import { getUserListOptions } from '@/features/users/api/get-all'
import { AddUser } from '@/features/users/components/add-user'
import { ApproveUser } from '@/features/users/components/approve-user'
import { BlockUser } from '@/features/users/components/block-user'

const USER_TABS = ['active', 'pending', 'blocked'] as const

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  user: 'Utilisateur',
}

const UserList = ({ emptyLabel, search, status }: { emptyLabel: string; search: string; status: 'active' | 'pending' | 'blocked' }) => {
  const { data: users } = useSuspenseQuery(getUserListOptions(status))
  const query = search.trim().toLowerCase()
  const filteredUsers = users.filter((userItem) => userItem.email.toLowerCase().includes(query) || userItem.role.toLowerCase().includes(query))

  if (filteredUsers.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">{search ? 'Aucun utilisateur trouvé pour cette recherche.' : emptyLabel}</p>
  }

  const showBlockButton = status === 'active' || status === 'pending'

  return (
    <ItemGroup>
      {filteredUsers.map((userItem, index) => (
        <React.Fragment key={userItem.id}>
          <Item
            actions={
              <>
                {(status === 'blocked' || status === 'pending') && <ApproveUser userId={userItem.id} />}
                {showBlockButton && <BlockUser userEmail={userItem.email} userId={userItem.id} />}
              </>
            }
            className="flex-nowrap"
            title={
              <>
                <span className="text-nowrap text-ellipsis">{userItem.email}</span>
                <Badge variant={userItem.role === 'admin' ? 'default' : 'secondary'}>{roleLabels[userItem.role]}</Badge>
              </>
            }
          />
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
      <div className="flex shrink-0 items-center gap-4 bg-muted pb-2">
        <SearchInput search={search} setSearch={setSearch} />
        <AddUser>
          <Button size="icon-lg" variant="outline">
            <PlusIcon />
          </Button>
        </AddUser>
      </div>

      <SwipeTabs className="-mb-4 flex min-h-0 flex-1 flex-col" defaultTab="active" tabs={USER_TABS}>
        <TabsList className="w-full">
          <TabsTab value="active">Actifs</TabsTab>
          <TabsTab value="pending">En attente</TabsTab>
          <TabsTab value="blocked">Bloqués</TabsTab>
        </TabsList>
        <SwipeTabsPanels>
          <div className="overflow-y-auto pb-4">
            <React.Suspense fallback={null}>
              <UserList emptyLabel="Aucun utilisateur actif." search={search} status="active" />
            </React.Suspense>
          </div>
          <div className="overflow-y-auto pb-4">
            <React.Suspense fallback={null}>
              <UserList emptyLabel="Aucun utilisateur en attente." search={search} status="pending" />
            </React.Suspense>
          </div>
          <div className="overflow-y-auto pb-4">
            <React.Suspense fallback={null}>
              <UserList emptyLabel="Aucun utilisateur bloqué." search={search} status="blocked" />
            </React.Suspense>
          </div>
        </SwipeTabsPanels>
      </SwipeTabs>
    </ScreenLayout>
  )
}

const RouteComponent = () => <UsersManagement />

export const Route = createFileRoute('/settings/users')({
  beforeLoad: ({ context }) => {
    if (context.authUser?.role !== 'admin') {
      throw redirect({ to: '/settings' })
    }
  },
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getUserListOptions('active'))
    await context.queryClient.ensureQueryData(getUserListOptions('blocked'))
    await context.queryClient.ensureQueryData(getUserListOptions('pending'))
  },
})
