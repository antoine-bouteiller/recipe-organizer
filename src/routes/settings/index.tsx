import { createFileRoute, Link, useRouter } from '@tanstack/solid-router'
import { For } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import CaretRight from '~icons/ph/caret-right'
import Cookie from '~icons/ph/cookie'
import User from '~icons/ph/user'
import Users from '~icons/ph/users'

import { ThemeIcon } from '@/components/icons/theme'
import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toggleTheme } from '@/lib/theme'

interface SettingsSection {
  adminOnly?: boolean
  description: string
  icon: typeof User
  id: string
  path: string
  title: string
}

const settingsSections: SettingsSection[] = [
  {
    description: 'Gérer vos informations de compte et vous déconnecter',
    icon: User,
    id: 'account',
    path: '/settings/account',
    title: 'Compte',
  },
  {
    description: 'Gérer la liste des ingrédients disponibles',
    icon: Cookie,
    id: 'ingredients',
    path: '/settings/ingredients',
    title: 'Ingrédients',
  },
  {
    adminOnly: true,
    description: 'Gérer les utilisateurs et leurs rôles',
    icon: Users,
    id: 'users',
    path: '/settings/users',
    title: 'Utilisateurs',
  },
]

const RouteComponent = () => {
  const context = Route.useRouteContext()
  const router = useRouter()

  return (
    <ScreenLayout pageKey="/settings" title="Paramètres">
      <Button
        class="mb-4 w-full justify-start gap-3 md:hidden"
        onClick={async () => {
          toggleTheme()
          await router.invalidate()
        }}
        variant="outline"
      >
        <ThemeIcon class="size-5" />
        Changer le thème
      </Button>
      <div class="grid gap-4 md:grid-cols-2">
        <For each={settingsSections.filter((section) => !section.adminOnly || context().isAdmin)}>
          {(section) => (
            <Link to={section.path} viewTransition>
              <Card class="h-full cursor-pointer p-4 transition-colors hover:bg-accent">
                <div class="flex items-start justify-between">
                  <div class="flex flex-1 items-start gap-3">
                    <div class="rounded-lg bg-primary/10 p-2">
                      <Dynamic class="h-5 w-5 text-primary" component={section.icon} />
                    </div>
                    <div class="flex-1">
                      <h3 class="font-semibold">{section.title}</h3>
                      <p class="mt-1 text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                  <CaretRight class="h-5 w-5 shrink-0 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          )}
        </For>
      </div>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
})
