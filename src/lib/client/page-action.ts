import { useRouter } from '@void/react'
import { useEffect, useEffectEvent } from 'react'
import type { VoidActionError } from 'void/pages-client'
import { submitAction } from 'void/pages-client'
import type { ActionUrl, ResolveActionBody, ResolveActionParams } from 'void/routes'
import * as z from 'zod'

import { alertError } from '@/lib/client/alert-error'
import { getErrorMessage } from '@/lib/client/api-client'

const validationSchema = z.object({ errors: z.record(z.string(), z.string()) })

const describe = (body: unknown) => {
  const validation = validationSchema.safeParse(body)
  return validation.success ? Object.values(validation.data.errors).join('\n') : getErrorMessage(body)
}

const interpolate = (url: string, params: readonly [string, unknown][]) =>
  params.reduce((resolved, [name, value]) => resolved.replace(`:${name}`, encodeURIComponent(String(value))), url)

type PageActionOptions<TUrl extends string> = { data: ResolveActionBody<TUrl> } & ([ResolveActionParams<TUrl>] extends [never]
  ? { params?: never }
  : { params: ResolveActionParams<TUrl> })

/**
 * Submits a page action and refreshes the page props in place.
 * Unlike `action()` from `@void/react`, it keeps the page URL and history entry instead of pushing `?action` URLs.
 * Resolves whether the action succeeded; expected failures are alerted with `message`.
 */
export const usePageAction = () => {
  const router = useRouter()

  return async <TUrl extends ActionUrl>(url: TUrl, options: PageActionOptions<TUrl>, message: string): Promise<boolean> => {
    const result = await submitAction(router, interpolate(url, Object.entries(options.params ?? {})), {
      data: options.data,
      method: 'POST',
      preserveState: true,
    })
    if (!result.ok) {
      alertError(message, new Error(describe(result.error.body)))
    }
    return result.ok
  }
}

/** Alert expected non-validation failures; Void projects validation errors into fields. */
export const useFormActionError = (error: VoidActionError | null, message: string) => {
  const showError = useEffectEvent((failure: VoidActionError) => alertError(message, new Error(describe(failure.body))))
  useEffect(() => {
    if (error) {
      showError(error)
    }
  }, [error])
}
