import { createFileRoute } from '@tanstack/solid-router'
import { createFileRoute, redirect } from '@tanstack/solid-router'

export const Route = createFileRoute('/settings')({
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ from: '/settings', to: '/auth/login' })
    }
  },
})
