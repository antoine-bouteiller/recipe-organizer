import { describe, expect, it, vi } from 'vite-plus/test'
import * as z from 'zod'

import { toApiErrorResponse, toApiValidationResponse } from './api-error'
import { HttpError } from './http-error'

const readContract = async (response: Response | undefined) => ({ body: await response?.json(), status: response?.status })

describe('toApiErrorResponse', () => {
  it('keeps an HTTP exception status and message', async () => {
    expect(await readContract(toApiErrorResponse(new HttpError(403, 'account_blocked')))).toEqual({
      body: { error: 'account_blocked' },
      status: 403,
    })
  })

  it('uses the generic message for an HTTP exception without one', async () => {
    expect(await readContract(toApiErrorResponse(new HttpError(404)))).toEqual({ body: { error: 'Une erreur est survenue' }, status: 404 })
  })

  it('reports a schema error as a bad request', async () => {
    const { error } = z.object({ name: z.string() }).safeParse({})

    expect(await readContract(toApiErrorResponse(error))).toEqual({
      body: { error: expect.stringMatching(/^Invalid Schema; .*name/su) },
      status: 400,
    })
  })

  it('hides unexpected errors behind a generic server error', async () => {
    const logError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(await readContract(toApiErrorResponse(new Error('D1 exploded')))).toEqual({ body: { error: 'Une erreur est survenue' }, status: 500 })

    logError.mockRestore()
  })
})

describe('toApiValidationResponse', () => {
  it('reports validator issues as a schema error', async () => {
    const body = { error: 'Validation failed', issues: [{ issues: [{ message: 'Invalid email', path: 'email' }], slot: 'body' }] }

    expect(await readContract(toApiValidationResponse(body))).toEqual({ body: { error: 'Invalid Schema; body.email: Invalid email' }, status: 400 })
  })

  it('reports an unreadable JSON body as a schema error', async () => {
    expect(await readContract(toApiValidationResponse({ error: 'Invalid JSON body' }))).toEqual({
      body: { error: 'Invalid Schema; Invalid JSON body' },
      status: 400,
    })
  })

  it('leaves other bad-request bodies untouched', () => {
    expect(toApiValidationResponse({ error: 'Invalid Schema; name: Required' })).toBeUndefined()
  })
})
