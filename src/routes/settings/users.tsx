import { useQuery } from '@tanstack/solid-query'
import { createFileRoute, redirect } from '@tanstack/solid-router'
import { createMemo, createSignal, For, type JSX, Show, Suspense } from 'solid-js'
import Plus from '~icons/ph/plus'
import Prohibit from '~icons/ph/prohibit'

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

type UserStatus = 'active' | 'blocked' | 'pending'

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  user: 'Utilisateur',
}

const SwipeToBlock = (props: { children: JSX.Element; userEmail: string; userId: string }) => {
  const [dialogOpen, setDialogOpen] = createSignal(false)
  let foregroundRef: HTMLDivElement | undefined = undefined
  let revealRef: HTMLDivElement | undefined = undefined
  const drag = { base: 0, direction: null as 'horizontal' | 'vertical' | null, startX: 0, startY: 0, x: 0 }

  const setX = (value: number, animated: boolean) => {
    drag.x = value
    if (foregroundRef) {
      foregroundRef.style.transition = animated ? RELEASE_TRANSITION : 'none'
      foregroundRef.style.transform = `translate3d(${value}px, 0, 0)`
    }
    if (revealRef) {
      revealRef.style.width = `${Math.max(0, -value)}px`
    }
  }

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches.item(0)
    if (!touch) {
      return
    }
    drag.base = drag.x
    drag.direction = null
    drag.startX = touch.clientX
    drag.startY = touch.clientY
  }

  const onTouchMove = (event: TouchEvent) => {
    const touch = event.touches.item(0)
    if (!touch) {
      return
    }
    const dx = touch.clientX - drag.startX
    const dy = touch.clientY - drag.startY

    if (!drag.direction) {
      if (Math.abs(dx) > DIRECTION_LOCK_THRESHOLD || Math.abs(dy) > DIRECTION_LOCK_THRESHOLD) {
        drag.direction = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
      }
      return
    }

    if (drag.direction !== 'horizontal') {
      return
    }

    event.preventDefault()
    let next = drag.base + dx
    if (next > 0) {
      next *= ELASTIC_FACTOR
    } else if (next < DRAG_MIN) {
      next = DRAG_MIN + (next - DRAG_MIN) * ELASTIC_FACTOR
    }
    setX(next, false)
  }

  const onTouchEnd = () => {
    if (drag.direction !== 'horizontal') {
      return
    }
    if (drag.x < SWIPE_THRESHOLD) {
      setDialogOpen(true)
    }
    setX(0, true)
  }

  return (
    <div class="relative overflow-hidden">
      <div
        class="absolute top-0 right-0 bottom-0 flex w-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground"
        ref={(el) => (revealRef = el)}
      >
        <Prohibit class="size-5 shrink-0" />
      </div>
      <div class="relative bg-muted" onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} ref={(el) => (foregroundRef = el)}>
        {props.children}
      </div>
      <BlockUser onOpenChange={setDialogOpen} open={dialogOpen()} userEmail={props.userEmail} userId={props.userId} />
    </div>
  )
}

const UserRow = (props: { isMobile: boolean; status: UserStatus; userEmail: string; userId: string; userRole: string }) => (
  <Item
    actions={
      <>
        <Show when={props.status === 'blocked' || props.status === 'pending'}>
          <ApproveUser userId={props.userId} />
        </Show>
        <Show when={!props.isMobile && (props.status === 'active' || props.status === 'pending')}>
          <BlockUser userEmail={props.userEmail} userId={props.userId} />
        </Show>
      </>
    }
    class="flex-nowrap"
    title={
      <>
        <span class="text-nowrap text-ellipsis">{props.userEmail}</span>
        <Badge variant={props.userRole === 'admin' ? 'default' : 'secondary'}>{roleLabels[props.userRole]}</Badge>
      </>
    }
  />
)

const UserList = (props: { emptyLabel: string; search: string; status: UserStatus }) => {
  const usersQuery = useQuery(() => getUserListOptions(props.status))
  const isMobile = useIsMobile()

  const filteredUsers = createMemo(() => {
    const query = props.search.trim().toLowerCase()
    return (usersQuery.data ?? []).filter((userItem) => userItem.email.toLowerCase().includes(query) || userItem.role.toLowerCase().includes(query))
  })

  const showBlockButton = () => props.status === 'active' || props.status === 'pending'

  return (
    <Show
      when={filteredUsers().length > 0}
      fallback={
        <p class="py-8 text-center text-muted-foreground">{props.search ? 'Aucun utilisateur trouvé pour cette recherche.' : props.emptyLabel}</p>
      }
    >
      <ItemGroup>
        <For each={filteredUsers()}>
          {(userItem, index) => (
            <>
              <Show
                when={isMobile() && showBlockButton()}
                fallback={
                  <UserRow isMobile={isMobile()} status={props.status} userEmail={userItem.email} userId={userItem.id} userRole={userItem.role} />
                }
              >
                <SwipeToBlock userEmail={userItem.email} userId={userItem.id}>
                  <UserRow isMobile={isMobile()} status={props.status} userEmail={userItem.email} userId={userItem.id} userRole={userItem.role} />
                </SwipeToBlock>
              </Show>
              <Show when={index() !== filteredUsers().length - 1}>
                <ItemSeparator />
              </Show>
            </>
          )}
        </For>
      </ItemGroup>
    </Show>
  )
}

const UsersManagement = () => {
  const [search, setSearch] = createSignal('')

  return (
    <ScreenLayout title="Utilisateurs" withGoBack>
      <div class="sticky top-0 z-10 flex items-center gap-4 bg-muted pb-2">
        <SearchInput search={search()} setSearch={setSearch} />
        <AddUser trigger={{ as: Button, children: <Plus />, size: 'icon-lg', variant: 'outline' }} />
      </div>

      <Tabs defaultValue="active">
        <TabsList class="w-full">
          <TabsTab value="active">Actifs</TabsTab>
          <TabsTab value="pending">En attente</TabsTab>
          <TabsTab value="blocked">Bloqués</TabsTab>
        </TabsList>
        <TabsPanel value="active">
          <Suspense fallback={null}>
            <UserList emptyLabel="Aucun utilisateur actif." search={search()} status="active" />
          </Suspense>
        </TabsPanel>
        <TabsPanel value="pending">
          <Suspense fallback={null}>
            <UserList emptyLabel="Aucun utilisateur en attente." search={search()} status="pending" />
          </Suspense>
        </TabsPanel>
        <TabsPanel value="blocked">
          <Suspense fallback={null}>
            <UserList emptyLabel="Aucun utilisateur bloqué." search={search()} status="blocked" />
          </Suspense>
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
