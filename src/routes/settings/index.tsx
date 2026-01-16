import { CaretRightIcon, CookieIcon, ScalesIcon, UserIcon } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Card } from '@/components/ui/card'

const settingsSections = [
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
    description: 'Gérer les unités de mesure disponibles',
    icon: ScalesIcon,
    id: 'units',
    path: '/settings/units',
    title: 'Unités de mesure',
  },
]

const RouteComponent = () => (
  <ScreenLayout title="Paramètres">
    <div className="grid gap-4 p-4 md:grid-cols-2">
      {settingsSections.map((section) => {
        const Icon = section.icon
        return (
          <Link key={section.id} to={section.path}>
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

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
})
