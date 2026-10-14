import { FetchError } from 'void/client'
import * as z from 'zod/mini'

import { toRequestBody } from './form-body'
import type { FormBody } from './form-body'

const fieldErrorsSchema = z.object({ errors: z.record(z.string(), z.string()) })

const readFieldErrors = (error: unknown) => {
  const cause = error instanceof Error && error.cause instanceof FetchError ? error.cause : error
  if (!(cause instanceof FetchError) || cause.status !== 400) {
    return undefined
  }
  const parsed = fieldErrorsSchema.safeParse(cause.data)
  return parsed.success && Object.keys(parsed.data.errors).length > 0 ? parsed.data.errors : undefined
}

export interface AppForm<TData extends object> {
  readonly data: TData
  readonly errors: Record<string, string>
  readonly pending: boolean
  /** Resolves `true` on success. A 400 with `errors` fills `errors` and resolves `false`. Other failures reject. */
  submit: (send: (body: FormBody<TData>) => Promise<unknown>) => Promise<boolean>
  reset: (values?: TData) => void
}

export const createForm = <TData extends object>(initial: TData): AppForm<TData> => {
  let data = $state(structuredClone(initial))
  let errors = $state<Record<string, string>>({})
  let pending = $state(false)

  return {
    get data() {
      return data
    },
    get errors() {
      return errors
    },
    get pending() {
      return pending
    },
    reset: (values = initial) => {
      data = structuredClone(values)
      errors = {}
    },
    submit: async (send) => {
      pending = true
      try {
        await send(toRequestBody(data))
        errors = {}
        return true
      } catch (error) {
        const fieldErrors = readFieldErrors(error)
        if (!fieldErrors) {
          throw error
        }
        errors = fieldErrors
        return false
      } finally {
        pending = false
      }
    },
  }
}
