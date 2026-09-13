import { describe, expect, it } from 'vite-plus/test'

import { assertOwnerOrAdmin } from './assert-owner-or-admin'

describe('assertOwnerOrAdmin', () => {
  it('allows the row owner', () => {
    expect(() => assertOwnerOrAdmin({ id: 'user-1', role: 'user' }, { createdBy: 'user-1' })).not.toThrow()
  })

  it('allows an admin who is not the owner', () => {
    expect(() => assertOwnerOrAdmin({ id: 'admin-1', role: 'admin' }, { createdBy: 'user-1' })).not.toThrow()
  })

  it('rejects a non-owner who is not an admin', () => {
    expect(() => assertOwnerOrAdmin({ id: 'user-2', role: 'user' }, { createdBy: 'user-1' })).toThrow('Permission denied')
  })

  it('rejects a non-admin when the row has no owner', () => {
    expect(() => assertOwnerOrAdmin({ id: 'user-1', role: 'user' }, { createdBy: null })).toThrow('Permission denied')
  })
})
