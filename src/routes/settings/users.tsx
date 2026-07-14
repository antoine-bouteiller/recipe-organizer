import { createFileRoute } from '@tanstack/solid-router'
import { PlusIcon, ProhibitIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/solid-router'
import React, { useRef, useState, type TouchEvent } from 'react'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Item, ItemGroup, ItemSeparator } from '@/components/ui/item'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import { getUserListOptions } from '@/features/users/api/get-all'
import { AddUser } from '@/features/users/components/add-user'
import { ApproveUser } from '@/features/users/components/approve-user'
import { BlockUser } from '@/features/users/components/block-user'
import { useIsMobile } from '@/hooks/use-is-mobile'

const SWIPE_THRESHOLD = -100
const DRAG_MIN = -150
const ELASTIC_FACTOR = 0.1
const DIRECTION_LOCK_THRESHOLD = 5
const RELEASE_TRANSITION = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)'

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  user: 'Utilisateur',
}

const SwipeToBlock = ({ children, userEmail, userId }: { children: React.ReactNode; userEmail: string; userId: string }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const foregroundRef = useRef<HTMLDivElement | null>(null)
  const revealRef = useRef<HTMLDivElement | null>(null)
  const drag = useRef({ base: 0, direction: null as 'horizontal' | 'vertical' | null, startX: 0, startY: 0, x: 0 })

  const setX = (value: number, animated: boolean) => {
    drag.current.x = value
    const foreground = foregroundRef.current
    const reveal = revealRef.current
    if (foreground) {
      foreground.style.transition = animated ? RELEASE_TRANSITION : 'none'
      foreground.style.transform = `translate3d(${value}px, 0, 0)`
    }
    if (reveal) {
      reveal.style.width = `${Math.max(0, -value)}px`
    }
  }

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches.item(0)
    if (!touch) {
      return
    }
    drag.current = { base: drag.current.x, direction: null, startX: touch.clientX, startY: touch.clientY, x: drag.current.x }
  }

  const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches.item(0)
    if (!touch) {
      return
    }
    const state = drag.current
    const dx = touch.clientX - state.startX
    const dy = touch.clientY - state.startY

    if (!state.direction) {
      if (Math.abs(dx) > DIRECTION_LOCK_THRESHOLD || Math.abs(dy) > DIRECTION_LOCK_THRESHOLD) {
        state.direction = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
      }
      return
    }

    if (state.direction !== 'horizontal') {
      return
    }

    event.preventDefault()
    let next = state.base + dx
    if (next > 0) {
      next *= ELASTIC_FACTOR
    } else if (next < DRAG_MIN) {
      next = DRAG_MIN + (next - DRAG_MIN) * ELASTIC_FACTOR
    }
    setX(next, false)
  }

  const onTouchEnd = () => {
    if (drag.current.direction !== 'horizontal') {
      return
    }
    if (drag.current.x < SWIPE_THRESHOLD) {
      setDialogOpen(true)
    }
    setX(0, true)
  }

  return (
    <div className="relative overflow-hidden">
      <div
        ref={revealRef}
        className="absolute top-0 right-0 bottom-0 flex w-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground"
      >
        <ProhibitIcon className="size-5 shrink-0" />
      </div>
      <div className="relative bg-muted" ref={foregroundRef} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart}>
        {children}
      </div>
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
    <ItemGroup>
      {filteredUsers.map((userItem, index) => {
        const item = (
          <Item
            actions={
              <>
                {(status === 'blocked' || status === 'pending') && <ApproveUser userId={userItem.id} />}
                {!isMobile && showBlockButton && <BlockUser userEmail={userItem.email} userId={userItem.id} />}
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
            {index !== filteredUsers.length - 1 && <ItemSeparator />}
          </React.Fragment>
        )
      })}
    </ItemGroup>
  )
}

const UsersManagement = () => {
  const [search, setSearch] = useState('')

  return (
    <ScreenLayout title="Utilisateurs" withGoBack>
      <div className="sticky top-0 z-10 flex items-center gap-4 bg-muted pb-2">
        <SearchInput search={search} setSearch={setSearch} />
        <AddUser>
          <Button size="icon-lg" variant="outline">
            <PlusIcon />
          </Button>
        </AddUser>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full">
          <TabsTab value="active">Actifs</TabsTab>
          <TabsTab value="pending">En attente</TabsTab>
          <TabsTab value="blocked">Bloqués</TabsTab>
        </TabsList>
        <TabsPanel value="active">
          <React.Suspense fallback={null}>
            <UserList emptyLabel="Aucun utilisateur actif." search={search} status="active" />
          </React.Suspense>
        </TabsPanel>
        <TabsPanel value="pending">
          <React.Suspense fallback={null}>
            <UserList emptyLabel="Aucun utilisateur en attente." search={search} status="pending" />
          </React.Suspense>
        </TabsPanel>
        <TabsPanel value="blocked">
          <React.Suspense fallback={null}>
            <UserList emptyLabel="Aucun utilisateur bloqué." search={search} status="blocked" />
          </React.Suspense>
        </TabsPanel>
      </Tabs>
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
