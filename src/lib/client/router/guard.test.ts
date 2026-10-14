import { describe, expect, it } from 'vite-plus/test'

import { resolveGuardRedirect } from './guard'

const identities = {
  admin: { role: 'admin', status: 'active' },
  anonymous: null,
  blocked: { role: 'user', status: 'blocked' },
  member: { role: 'user', status: 'active' },
  pending: { role: 'user', status: 'pending' },
}

describe('resolveGuardRedirect (VC-5)', () => {
  it.each([
    ['member', 'anonymous', '/auth/login'],
    ['member', 'pending', '/auth/login?error=account_pending'],
    ['member', 'blocked', '/auth/login?error=account_blocked'],
    ['member', 'member', undefined],
    ['member', 'admin', undefined],
    ['admin', 'anonymous', '/auth/login'],
    ['admin', 'pending', '/auth/login?error=account_pending'],
    ['admin', 'blocked', '/auth/login?error=account_blocked'],
    ['admin', 'member', '/settings'],
    ['admin', 'admin', undefined],
    ['guest', 'anonymous', undefined],
    ['guest', 'pending', undefined],
    ['guest', 'blocked', undefined],
    ['guest', 'member', '/'],
    ['guest', 'admin', '/'],
  ] as const)('sends a %s route visited by %s to %s', (access, identity, redirect) => {
    expect(resolveGuardRedirect(access, identities[identity])).toBe(redirect)
  })

  it('lets every identity see a public route', () => {
    for (const identity of Object.values(identities)) {
      expect(resolveGuardRedirect(undefined, identity)).toBeUndefined()
    }
  })
})
