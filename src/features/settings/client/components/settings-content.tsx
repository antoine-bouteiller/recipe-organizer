import { Link } from '@void/react'

import { Button } from '@/design-system/ui/actions/button/button'
import { Card } from '@/design-system/ui/data-display/card/card'
import { CaretRightIcon, CookieIcon, ThemeIcon, UserIcon, UsersIcon } from '@/design-system/ui/data-display/icons'
import type { IconProps } from '@/design-system/ui/data-display/icons'
import { toggleTheme } from '@/lib/client/theme'

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
            <Link href={section.path} key={section.id}>
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
