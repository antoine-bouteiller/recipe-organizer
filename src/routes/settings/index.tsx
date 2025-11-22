import { ScreenLayout } from '@/components/layout/screen-layout'
import { Card } from '@/components/ui/card'
import { CaretRightIcon, CookieIcon, ScalesIcon, UserIcon } from '@phosphor-icons/react'
import { Link, createFileRoute } from '@tanstack/react-router'

const settingsSections = [
  {
    id: 'account',
    title: 'Compte',
    description: 'Gérer vos informations de compte et vous déconnecter',
    icon: UserIcon,
    path: '/settings/account',
  },
  {
    id: 'ingredients',
    title: 'Ingrédients',
    description: 'Gérer la liste des ingrédients disponibles',
    icon: CookieIcon,
    path: '/settings/ingredients',
  },
  {
    id: 'units',
    title: 'Unités de mesure',
    description: 'Gérer les unités de mesure disponibles',
    icon: ScalesIcon,
    path: '/settings/units',
  },
]

const RouteComponent = () => (
  <ScreenLayout title="Paramètres">
    <div className="grid gap-4 md:grid-cols-2 p-4">
      {settingsSections.map((section) => {
        const Icon = section.icon
        return (
          <Link key={section.id} to={section.path}>
            <Card className="p-4 hover:bg-accent transition-colors cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                  </div>
                </div>
                <CaretRightIcon className="h-5 w-5 text-muted-foreground shrink-0" />
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
