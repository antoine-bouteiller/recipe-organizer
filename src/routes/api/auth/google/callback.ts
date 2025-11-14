import { handleGoogleCallback } from '@/features/auth/api/google-auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/google/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')

        if (!code || !state) {
          throw new Error('Missing code or state')
        }

        await handleGoogleCallback(code, state)

        throw redirect({ to: '/' })
      },
    },
  },
})
