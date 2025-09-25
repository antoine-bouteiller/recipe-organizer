import { auth } from '@/lib/auth'
import { withServerErrorCapture } from '@/lib/error-handler'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

export const getAuthUser = createServerFn({ method: 'GET' }).handler(
  withServerErrorCapture(async () => {
    const request = getRequest()
    if (!request?.headers) {
      return undefined
    }
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    return session?.user
  })
)
