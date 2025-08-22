import { createAuthClient } from 'better-auth/react'

import { magicLinkClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_PUBLIC_URL,
  plugins: [magicLinkClient()],
})
