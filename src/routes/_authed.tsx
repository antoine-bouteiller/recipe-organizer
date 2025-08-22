import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { LogOutIcon } from 'lucide-react'

const Layout = () => {
  const { signOut } = useAuth()

  return (
    <div>
      <div className="flex justify-end p-2">
        <Button onClick={signOut} variant="ghost">
          <LogOutIcon />
        </Button>
      </div>
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ to: '/auth/login' })
    }
  },
  component: Layout,
})
