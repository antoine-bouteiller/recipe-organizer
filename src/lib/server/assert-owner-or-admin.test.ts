import { describe, expect, it } from 'vite-plus/test'

import { assertOwnerOrAdmin } from './assert-owner-or-admin'

describe('assertOwnerOrAdmin', () => {
  it('allows the row owner', () => {
    expect(() => assertOwnerOrAdmin({ id: 'user-1', role: 'user' }, { createdBy: 'user-1' })).not.toThrow()
  })

  it('allows an admin who is not the owner', () => {
    expect(() => assertOwnerOrAdmin({ id: 'admin-1', role: 'admin' }, { createdBy: 'user-1' })).not.toThrow()
  })

  it.each([
    { createdBy: 'user-1', name: 'another user owns the row' },
    { createdBy: null, name: 'the row has no owner' },
  ])('rejects a non-admin with HTTP 403 when $name', ({ createdBy }) => {
    expect(() => assertOwnerOrAdmin({ id: 'user-2', role: 'user' }, { createdBy })).toThrow(
      expect.objectContaining({ message: 'Permission denied', status: 403 })
    )
  })
})
