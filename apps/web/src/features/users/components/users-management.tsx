import { getUserListOptions } from '@client/features/users/api/get-all'
import { AddUser } from '@client/features/users/components/add-user'
import { ApproveUser } from '@client/features/users/components/approve-user'
import { BlockUser } from '@client/features/users/components/block-user'
import { Badge } from '@recipe-organizer/design-system/badge'
import { Button } from '@recipe-organizer/design-system/button'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { Item, ItemGroup, ItemSeparator } from '@recipe-organizer/design-system/item'
import { SearchInput } from '@recipe-organizer/design-system/search-input'
import { SwipeTabs, SwipeTabsPanel, SwipeTabsPanels, TabsList, TabsTab } from '@recipe-organizer/design-system/tabs'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

import * as styles from './users-management.css'

const USER_TABS = ['active', 'pending', 'blocked'] as const
const roleLabels = new Map([
  ['admin', 'Admin'],
  ['user', 'Utilisateur'],
])
type UserStatus = (typeof USER_TABS)[number]

const UserList = ({ emptyLabel, search, status }: { emptyLabel: string; search: string; status: UserStatus }) => {
  const { data: users } = useSuspenseQuery(getUserListOptions(status))
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

export const UsersManagement = () => {
  const [search, setSearch] = useState('')
  return (
    <>
      <div className={styles.searchBar}>
        <SearchInput placeholder="Rechercher une recette, un ingrédient…" search={search} setSearch={setSearch} />
        <AddUser>
          <Button aria-label="Ajouter un utilisateur" size="icon-lg" variant="outline">
            <PlusIcon />
          </Button>
        </AddUser>
      </div>
      <div className={styles.tabs}>
        <SwipeTabs defaultTab="active" tabs={USER_TABS}>
          <TabsList width="full">
            <TabsTab value="active">Actifs</TabsTab>
            <TabsTab value="pending">En attente</TabsTab>
            <TabsTab value="blocked">Bloqués</TabsTab>
          </TabsList>
          <SwipeTabsPanels>
            <SwipeTabsPanel value="active">
              <div className={styles.panel}>
                <React.Suspense fallback={null}>
                  <UserList emptyLabel="Aucun utilisateur actif." search={search} status="active" />
                </React.Suspense>
              </div>
            </SwipeTabsPanel>
            <SwipeTabsPanel value="pending">
              <div className={styles.panel}>
                <React.Suspense fallback={null}>
                  <UserList emptyLabel="Aucun utilisateur en attente." search={search} status="pending" />
                </React.Suspense>
              </div>
            </SwipeTabsPanel>
            <SwipeTabsPanel value="blocked">
              <div className={styles.panel}>
                <React.Suspense fallback={null}>
                  <UserList emptyLabel="Aucun utilisateur bloqué." search={search} status="blocked" />
                </React.Suspense>
              </div>
            </SwipeTabsPanel>
          </SwipeTabsPanels>
        </SwipeTabs>
      </div>
    </>
  )
}
