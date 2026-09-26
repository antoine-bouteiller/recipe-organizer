import { useToggleTheme } from '@client/hooks/use-toggle-theme'
import { Button } from '@recipe-organizer/design-system/button'
import { Card } from '@recipe-organizer/design-system/card'
import { CaretRightIcon } from '@recipe-organizer/design-system/icons/caret-right'
import { CookieIcon } from '@recipe-organizer/design-system/icons/cookie'
import { ThemeIcon } from '@recipe-organizer/design-system/icons/theme'
import type { IconProps } from '@recipe-organizer/design-system/icons/types'
import { UserIcon } from '@recipe-organizer/design-system/icons/user'
import { UsersIcon } from '@recipe-organizer/design-system/icons/users'
import { Link } from '@tanstack/react-router'

import * as styles from './settings-content.css'

interface SettingsSection {
  adminOnly?: boolean
  description: string
  icon: React.ComponentType<IconProps>
  id: string
  path: string
  title: string
}

const settingsSections: SettingsSection[] = [
  { description: 'Gérer vos informations de compte et vous déconnecter', icon: UserIcon, id: 'account', path: '/settings/account', title: 'Compte' },
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

interface SettingsContentProps {
  readonly isAdmin: boolean
}

export const SettingsContent = ({ isAdmin }: SettingsContentProps) => {
  const toggleTheme = useToggleTheme()
  const visibleSections = settingsSections.filter((section) => !section.adminOnly || isAdmin)

  return (
    <>
      <div className={styles.themeToggle}>
        <Button onClick={toggleTheme} variant="outline" width="full" align="start">
          <ThemeIcon size="lg" />
          Changer le thème
        </Button>
      </div>
      <div className={styles.sections}>
        {visibleSections.map((section) => {
          const Icon = section.icon
          return (
            <Link key={section.id} to={section.path} viewTransition>
              <div className={styles.sectionLink}>
                <Card>
                  <div className={styles.sectionCard}>
                    <div className={styles.sectionContent}>
                      <div className={styles.sectionIcon}>
                        <Icon size="lg" />
                      </div>
                      <div className={styles.sectionDetails}>
                        <h3 className={styles.sectionTitle}>{section.title}</h3>
                        <p className={styles.sectionDescription}>{section.description}</p>
                      </div>
                    </div>
                    <span className={styles.sectionCaret}>
                      <CaretRightIcon size="lg" />
                    </span>
                  </div>
                </Card>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
