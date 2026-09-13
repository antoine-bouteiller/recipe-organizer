import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ from: '/settings', to: '/auth/login' })
    }
  },
})
