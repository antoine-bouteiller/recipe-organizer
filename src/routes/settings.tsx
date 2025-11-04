import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { CaretRightIcon, CookieIcon, UserIcon } from '@phosphor-icons/react'
import { Link, createFileRoute, redirect } from '@tanstack/react-router'

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
]

const RouteComponent = () => {
  const { authUser } = Route.useRouteContext()
  const auth = useAuth()

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos préférences et paramètres de l&apos;application
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
                  <CaretRightIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="border-t pt-6 mt-2">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Compte actuel</h2>
            <p className="text-sm mt-1">{authUser?.email}</p>
          </div>
          <Button onClick={() => auth.signOut()} variant="outline" size="sm">
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ to: '/auth/login', from: '/settings' })
    }
  },
})
