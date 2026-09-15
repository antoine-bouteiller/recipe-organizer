import { ScreenLayout } from '@client/components/layout/screen-layout'
import { useToggleTheme } from '@client/hooks/use-toggle-theme'
import { Button } from '@recipe-organizer/design-system/button'
import { Card } from '@recipe-organizer/design-system/card'
import { CaretRightIcon } from '@recipe-organizer/design-system/icons/caret-right'
import { CookieIcon } from '@recipe-organizer/design-system/icons/cookie'
import { ThemeIcon } from '@recipe-organizer/design-system/icons/theme'
import { type IconProps } from '@recipe-organizer/design-system/icons/types'
import { UserIcon } from '@recipe-organizer/design-system/icons/user'
import { UsersIcon } from '@recipe-organizer/design-system/icons/users'
import { createFileRoute, Link } from '@tanstack/react-router'

interface SettingsSection {
  adminOnly?: boolean
  description: string
  icon: React.ComponentType<IconProps>
  id: string
  path: string
  title: string
}

const settingsSections: SettingsSection[] = [
  {
    description: 'Gérer vos informations de compte et vous déconnecter',
    icon: UserIcon,
    id: 'account',
    path: '/settings/account',
    title: 'Compte',
  },
  {
    description: 'Gérer la liste des ingrédients disponibles',
    icon: CookieIcon,
    id: 'ingredients',
    path: '/settings/ingredients',
    title: 'Ingrédients',
  },
  {
    adminOnly: true,
    description: 'Gérer les utilisateurs et leurs rôles',
    icon: UsersIcon,
    id: 'users',
    path: '/settings/users',
    title: 'Utilisateurs',
  },
]

const RouteComponent = () => {
  const { isAdmin } = Route.useRouteContext()
  const toggleTheme = useToggleTheme()

  const visibleSections = settingsSections.filter((section) => !section.adminOnly || isAdmin)

  return (
    <ScreenLayout title="Paramètres" pageKey="/settings">
      <Button className="mb-4 w-full justify-start gap-3 md:hidden" onClick={toggleTheme} variant="outline">
        <ThemeIcon className="size-5" />
        Changer le thème
      </Button>
      <div className="grid gap-4 md:grid-cols-2">
        {visibleSections.map((section) => {
          const Icon = section.icon
          return (
            <Link key={section.id} to={section.path} viewTransition>
              <Card className="h-full cursor-pointer p-4 transition-colors hover:bg-accent">
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                  <CaretRightIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
})
