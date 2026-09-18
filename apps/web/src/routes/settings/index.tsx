import { mobileMenuItems } from '@client/components/navigation/constants'
import { useToggleTheme } from '@client/hooks/use-toggle-theme'
import { Button } from '@recipe-organizer/design-system/button'
import { Card } from '@recipe-organizer/design-system/card'
import { CaretRightIcon } from '@recipe-organizer/design-system/icons/caret-right'
import { CookieIcon } from '@recipe-organizer/design-system/icons/cookie'
import { ThemeIcon } from '@recipe-organizer/design-system/icons/theme'
import { type IconProps } from '@recipe-organizer/design-system/icons/types'
import { UserIcon } from '@recipe-organizer/design-system/icons/user'
import { UsersIcon } from '@recipe-organizer/design-system/icons/users'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'
import { createFileRoute, Link } from '@tanstack/react-router'

import * as styles from './index.css'

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
    <ScreenLayout title="Paramètres" footer={<TabBar items={mobileMenuItems} />}>
      <div className={styles.container}>
        <Button onClick={toggleTheme} variant="outline" width="full" align="start">
          <ThemeIcon size="lg" />
          Changer le thème
        </Button>
      </div>
      <div className={styles.container2}>
        {visibleSections.map((section) => {
          const Icon = section.icon
          return (
            <Link key={section.id} to={section.path} viewTransition>
              <div className={styles.container3}>
                <Card>
                  <div className={styles.container4}>
                    <div className={styles.container5}>
                      <div className={styles.container6}>
                        <Icon size="lg" />
                      </div>
                      <div className={styles.container7}>
                        <h3 className={styles.heading}>{section.title}</h3>
                        <p className={styles.text}>{section.description}</p>
                      </div>
                    </div>
                    <span className={styles.text2}>
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
