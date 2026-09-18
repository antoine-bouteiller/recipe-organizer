import { getUserListOptions } from '@client/features/users/api/get-all'
import { UsersManagement } from '@client/features/users/components/users-management'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { createFileRoute, redirect } from '@tanstack/react-router'

const RouteComponent = () => (
  <ScreenLayout title="Utilisateurs" withGoBack>
    <UsersManagement />
  </ScreenLayout>
)

export const Route = createFileRoute('/settings/users')({
  beforeLoad: ({ context }) => {
    if (context.authUser?.role !== 'admin') {
      throw redirect({ to: '/settings' })
    }
  },
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.query({ ...getUserListOptions('active'), staleTime: 'static' })
    await context.queryClient.query({ ...getUserListOptions('blocked'), staleTime: 'static' })
    await context.queryClient.query({ ...getUserListOptions('pending'), staleTime: 'static' })
  },
})
