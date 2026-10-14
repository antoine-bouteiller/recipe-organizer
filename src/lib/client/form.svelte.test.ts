import { describe, expect, it } from 'vite-plus/test'
import { FetchError } from 'void/client'

import { createForm } from './form.svelte'

const fetchError = (status: number, data: unknown) => Object.assign(new FetchError('failed'), { data, status })
const readResponseError = (status: number, data: unknown) => new Error('Invalid Schema', { cause: fetchError(status, data) })

describe('createForm', () => {
  it('sends a JSON snapshot and resolves true on success', async () => {
    const form = createForm({ name: 'Tarte', tags: ['sucré'] })
    let sent: unknown = undefined
    expect(
      await form.submit(async (body) => {
        sent = body
      })
    ).toBe(true)
    expect(sent).toEqual({ name: 'Tarte', tags: ['sucré'] })
    expect(form.pending).toBe(false)
  })

  it('sends multipart when a value is a file', async () => {
    const form = createForm({ image: new File(['x'], 'photo.png'), name: 'Tarte' })
    let sent: unknown = undefined
    await form.submit(async (body) => {
      sent = body
    })
    expect(sent).toBeInstanceOf(FormData)
  })

  it('is pending while the request runs', async () => {
    const form = createForm({ name: '' })
    let pendingDuringSend = false
    await form.submit(async () => {
      pendingDuringSend = form.pending
    })
    expect(pendingDuringSend).toBe(true)
  })

  it('fills field errors from a 400 and resolves false', async () => {
    const form = createForm({ name: '' })
    const errors = { name: 'Trop court' }
    expect(await form.submit(() => Promise.reject(readResponseError(400, { error: 'Invalid Schema; name: Trop court', errors })))).toBe(false)
    expect(form.errors).toEqual(errors)
    expect(form.pending).toBe(false)
  })

  it('clears field errors after a successful retry', async () => {
    const form = createForm({ name: '' })
    await form.submit(() => Promise.reject(readResponseError(400, { error: 'x', errors: { name: 'Trop court' } })))
    await form.submit(() => Promise.resolve())
    expect(form.errors).toEqual({})
  })

  it('rejects other failures, including a 400 without field errors', async () => {
    const form = createForm({ name: '' })
    const forbidden = readResponseError(403, { error: 'Permission denied' })
    await expect(form.submit(() => Promise.reject(forbidden))).rejects.toBe(forbidden)
    const unreadable = readResponseError(400, { error: 'Invalid Schema; Invalid JSON body', errors: {} })
    await expect(form.submit(() => Promise.reject(unreadable))).rejects.toBe(unreadable)
    expect(form.pending).toBe(false)
  })

  it('resets to the initial or given values and clears errors', async () => {
    const form = createForm({ email: '', role: 'user' })
    await form.submit(() => Promise.reject(readResponseError(400, { error: 'x', errors: { email: 'Invalide' } })))
    form.data.email = 'a@b.fr'
    form.reset()
    expect(form.data).toEqual({ email: '', role: 'user' })
    expect(form.errors).toEqual({})
    form.reset({ email: 'c@d.fr', role: 'admin' })
    expect(form.data).toEqual({ email: 'c@d.fr', role: 'admin' })
  })
})
