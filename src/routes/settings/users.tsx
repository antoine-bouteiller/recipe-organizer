import { PlusIcon, ProhibitIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import React, { useState } from 'react'

import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Item } from '@/components/common/item'
import { Tabs } from '@/components/common/tabs'
import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { getUserListOptions } from '@/features/users/api/get-all'
import { AddUser } from '@/features/users/components/add-user'
import { ApproveUser } from '@/features/users/components/approve-user'
import { BlockUser } from '@/features/users/components/block-user'
import { useIsMobile } from '@/hooks/use-is-mobile'

const SWIPE_THRESHOLD = -100

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  user: 'Utilisateur',
}

const SwipeToBlock = ({ children, userEmail, userId }: { children: React.ReactNode; userEmail: string; userId: string }) => {
  const swipeX = useMotionValue(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const buttonWidth = useTransform(swipeX, (val) => Math.max(0, -val))

  const handleDragEnd = () => {
    if (swipeX.get() < SWIPE_THRESHOLD) {
      animate(swipeX, 0, { damping: 30, stiffness: 300, type: 'spring' })
      setDialogOpen(true)
    } else {
      animate(swipeX, 0, { damping: 30, stiffness: 300, type: 'spring' })
    }
  }

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute top-0 right-0 bottom-0 flex items-center justify-center rounded-xl bg-destructive text-destructive-foreground"
        style={{ width: buttonWidth }}
      >
        <ProhibitIcon className="size-5 shrink-0" />
      </motion.div>
      <motion.div
        className="relative bg-background"
        drag="x"
        dragConstraints={{ left: -150, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x: swipeX }}
      >
        {children}
      </motion.div>
      <BlockUser onOpenChange={setDialogOpen} open={dialogOpen} userEmail={userEmail} userId={userId} />
    </div>
  )
}

const UserList = ({ emptyLabel, search, status }: { emptyLabel: string; search: string; status: 'active' | 'pending' | 'blocked' }) => {
  const { data: users } = useSuspenseQuery(getUserListOptions(status))
  const isMobile = useIsMobile()
  const query = search.trim().toLowerCase()
  const filteredUsers = users.filter((userItem) => userItem.email.toLowerCase().includes(query) || userItem.role.toLowerCase().includes(query))

  if (filteredUsers.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">{search ? 'Aucun utilisateur trouvé pour cette recherche.' : emptyLabel}</p>
  }

  const showBlockButton = status === 'active' || status === 'pending'

  return (
    <Item.Group>
      {filteredUsers.map((userItem, index) => {
        const item = (
          <Item className="flex-nowrap">
            <Item.Content>
              <Item.Title>
                <span className="text-nowrap text-ellipsis">{userItem.email}</span>
                <Badge variant={userItem.role === 'admin' ? 'default' : 'secondary'}>{roleLabels[userItem.role]}</Badge>
              </Item.Title>
            </Item.Content>
            <Item.Actions>
              {(status === 'blocked' || status === 'pending') && <ApproveUser userId={userItem.id} />}
              {!isMobile && showBlockButton && <BlockUser userEmail={userItem.email} userId={userItem.id} />}
            </Item.Actions>
          </Item>
        )

        return (
          <React.Fragment key={userItem.id}>
            {isMobile && showBlockButton ? (
              <SwipeToBlock userEmail={userItem.email} userId={userItem.id}>
                {item}
              </SwipeToBlock>
            ) : (
              item
            )}
            {index !== filteredUsers.length - 1 && <Item.Separator />}
          </React.Fragment>
        )
      })}
    </Item.Group>
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
          <Tabs.List className="w-full">
            <Tabs.Tab value="active">Actifs</Tabs.Tab>
            <Tabs.Tab value="pending">En attente</Tabs.Tab>
            <Tabs.Tab value="blocked">Bloqués</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="active">
            <React.Suspense fallback={null}>
              <UserList emptyLabel="Aucun utilisateur actif." search={search} status="active" />
            </React.Suspense>
          </Tabs.Panel>

          <Tabs.Panel value="pending">
            <React.Suspense fallback={null}>
              <UserList emptyLabel="Aucun utilisateur en attente." search={search} status="pending" />
            </React.Suspense>
          </Tabs.Panel>

          <Tabs.Panel value="blocked">
            <React.Suspense fallback={null}>
              <UserList emptyLabel="Aucun utilisateur bloqué." search={search} status="blocked" />
            </React.Suspense>
          </Tabs.Panel>
        </Tabs>
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
    await context.queryClient.ensureQueryData(getUserListOptions('active'))
    await context.queryClient.ensureQueryData(getUserListOptions('blocked'))
    await context.queryClient.ensureQueryData(getUserListOptions('pending'))
  },
})
