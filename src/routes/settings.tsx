import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

const RouteComponent = () => {
  const { authUser } = Route.useRouteContext()

  const auth = useAuth()
  return (
    <div className="flex flex-col gap-4 items-center p-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p>{authUser?.email}</p>
      <Button onClick={() => auth.signOut()}>Sign out</Button>
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
