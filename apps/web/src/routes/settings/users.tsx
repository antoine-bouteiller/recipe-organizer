import { ScreenLayout } from '@client/components/layout/screen-layout'
import { getUserListOptions } from '@client/features/users/api/get-all'
import { AddUser } from '@client/features/users/components/add-user'
import { ApproveUser } from '@client/features/users/components/approve-user'
import { BlockUser } from '@client/features/users/components/block-user'
import { Badge } from '@recipe-organizer/design-system/badge'
import { Button } from '@recipe-organizer/design-system/button'
import { css } from '@recipe-organizer/design-system/css'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { Item, ItemGroup, ItemSeparator } from '@recipe-organizer/design-system/item'
import { SearchInput } from '@recipe-organizer/design-system/search-input'
import { SwipeTabs, SwipeTabsPanel, SwipeTabsPanels, TabsList, TabsTab } from '@recipe-organizer/design-system/tabs'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import React, { useState } from 'react'

const USER_TABS = ['active', 'pending', 'blocked'] as const

const roleLabels = new Map([
  ['admin', 'Admin'],
  ['user', 'Utilisateur'],
])

const UserList = ({ emptyLabel, search, status }: { emptyLabel: string; search: string; status: 'active' | 'pending' | 'blocked' }) => {
  const { data: users } = useSuspenseQuery(getUserListOptions(status))
  const query = search.trim().toLowerCase()
  const filteredUsers = users.filter((userItem) => userItem.email.toLowerCase().includes(query) || userItem.role.toLowerCase().includes(query))

  if (filteredUsers.length === 0) {
    return (
      <p className={css({ color: 'muted-foreground', paddingBlock: '8', textAlign: 'center' })}>
        {search ? 'Aucun utilisateur trouvé pour cette recherche.' : emptyLabel}
      </p>
    )
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
            layout="row"
            title={
              <>
                <span className={css({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>{userItem.email}</span>
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

const UsersManagement = () => {
  const [search, setSearch] = useState('')

  return (
    <ScreenLayout title="Utilisateurs" withGoBack>
      <div className={css({ alignItems: 'center', background: 'muted', display: 'flex', flexShrink: '0', gap: '4', paddingBottom: '2' })}>
        <SearchInput placeholder="Rechercher une recette, un ingrédient…" search={search} setSearch={setSearch} />
        <AddUser>
          <Button size="icon-lg" variant="search-trigger">
            <PlusIcon />
          </Button>
        </AddUser>
      </div>

      <div className={css({ display: 'flex', flex: '1', flexDirection: 'column', marginBottom: '-4', minHeight: '0' })}>
        <SwipeTabs defaultTab="active" tabs={USER_TABS}>
          <TabsList width="full">
            <TabsTab value="active">Actifs</TabsTab>
            <TabsTab value="pending">En attente</TabsTab>
            <TabsTab value="blocked">Bloqués</TabsTab>
          </TabsList>
          <SwipeTabsPanels>
            <SwipeTabsPanel value="active">
              <div className={css({ height: 'full', overflowY: 'auto', paddingBottom: '4' })}>
                <React.Suspense fallback={null}>
                  <UserList emptyLabel="Aucun utilisateur actif." search={search} status="active" />
                </React.Suspense>
              </div>
            </SwipeTabsPanel>
            <SwipeTabsPanel value="pending">
              <div className={css({ height: 'full', overflowY: 'auto', paddingBottom: '4' })}>
                <React.Suspense fallback={null}>
                  <UserList emptyLabel="Aucun utilisateur en attente." search={search} status="pending" />
                </React.Suspense>
              </div>
            </SwipeTabsPanel>
            <SwipeTabsPanel value="blocked">
              <div className={css({ height: 'full', overflowY: 'auto', paddingBottom: '4' })}>
                <React.Suspense fallback={null}>
                  <UserList emptyLabel="Aucun utilisateur bloqué." search={search} status="blocked" />
                </React.Suspense>
              </div>
            </SwipeTabsPanel>
          </SwipeTabsPanels>
        </SwipeTabs>
      </div>
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
    await context.queryClient.query({ ...getUserListOptions('active'), staleTime: 'static' })
    await context.queryClient.query({ ...getUserListOptions('blocked'), staleTime: 'static' })
    await context.queryClient.query({ ...getUserListOptions('pending'), staleTime: 'static' })
  },
})
