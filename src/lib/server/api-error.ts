import * as z from 'zod'

import { HttpError } from './http-error'

const fallbackMessage = 'Une erreur est survenue'

const voidValidationBodySchema = z.union([
  z.object({
    error: z.literal('Validation failed'),
    issues: z.array(z.object({ issues: z.array(z.object({ message: z.string(), path: z.string().optional() })), slot: z.string() })),
  }),
  z.object({ error: z.literal('Invalid JSON body') }),
])

const formatValidationBody = (body: z.infer<typeof voidValidationBodySchema>) =>
  'issues' in body
    ? body.issues.flatMap(({ issues, slot }) => issues.map(({ message, path }) => `${[slot, path].filter(Boolean).join('.')}: ${message}`)).join('; ')
    : body.error

/** Maps an error thrown by an API handler to the API's JSON error contract. */
export const toApiErrorResponse = (error: unknown): Response => {
  if (error instanceof HttpError) {
    return Response.json({ error: error.message || fallbackMessage }, { status: error.status })
  }
  if (error instanceof z.ZodError) {
    return Response.json({ error: `Invalid Schema; ${z.prettifyError(error)}` }, { status: 400 })
  }
  // oxlint-disable-next-line no-console -- Keep server diagnostics out of the HTTP response.
  console.error(error)
  return Response.json({ error: fallbackMessage }, { status: 500 })
}

/** Maps a body produced by Void's `withValidator` to the API's JSON error contract, if it is one. */
export const toApiValidationResponse = (body: unknown): Response | undefined => {
  const parsed = voidValidationBodySchema.safeParse(body)
  if (!parsed.success) {
    return undefined
  }
  return Response.json({ error: `Invalid Schema; ${formatValidationBody(parsed.data)}` }, { status: 400 })
}
