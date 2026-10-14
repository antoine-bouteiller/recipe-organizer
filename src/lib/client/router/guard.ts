export type Access = 'admin' | 'guest' | 'member'

export interface SessionIdentity {
  readonly role: string | null
  readonly status: string | null
}

/** The redirect a guarded route sends `session` to, or `undefined` when it may see the route. */
export const resolveGuardRedirect = (access: Access | undefined, session: SessionIdentity | null): string | undefined => {
  if (access === 'guest') {
    return session?.status === 'active' ? '/' : undefined
  }
  if (!access) {
    return undefined
  }
  if (!session) {
    return '/auth/login'
  }
  if (session.status === 'blocked' || session.status === 'pending') {
    return `/auth/login?error=account_${session.status}`
  }
  return access === 'admin' && session.role !== 'admin' ? '/settings' : undefined
}
