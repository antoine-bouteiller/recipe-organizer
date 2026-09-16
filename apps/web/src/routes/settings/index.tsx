import { ScreenLayout } from '@client/components/layout/screen-layout'
import { useToggleTheme } from '@client/hooks/use-toggle-theme'
import { Button } from '@recipe-organizer/design-system/button'
import { Card } from '@recipe-organizer/design-system/card'
import { css } from '@recipe-organizer/design-system/css'
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
      <div className={css({ display: { base: 'block', md: 'none' }, marginBottom: '4', width: 'full' })}>
        <Button onClick={toggleTheme} variant="outline" width="full" align="start">
          <ThemeIcon size="lg" />
          Changer le thème
        </Button>
      </div>
      <div className={css({ display: 'grid', gap: '4', gridTemplateColumns: { md: 'repeat(2, minmax(0, 1fr))' } })}>
        {visibleSections.map((section) => {
          const Icon = section.icon
          return (
            <Link key={section.id} to={section.path} viewTransition>
              <div className={css({ cursor: 'pointer', height: 'full', padding: '4' })}>
                <Card>
                  <div className={css({ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between' })}>
                    <div className={css({ alignItems: 'flex-start', display: 'flex', flex: '1', gap: '3' })}>
                      <div className={css({ background: 'primary/10', borderRadius: 'lg', color: 'primary', padding: '2' })}>
                        <Icon size="lg" />
                      </div>
                      <div className={css({ flex: '1' })}>
                        <h3 className={css({ fontWeight: 'semibold' })}>{section.title}</h3>
                        <p className={css({ color: 'muted-foreground', fontSize: 'sm', marginTop: '1' })}>{section.description}</p>
                      </div>
                    </div>
                    <span className={css({ color: 'muted-foreground', flexShrink: '0' })}>
                      <CaretRightIcon size="lg" />
                    </span>
                  </div>
                </Card>
              </div>
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
