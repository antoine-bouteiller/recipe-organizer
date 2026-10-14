import type { QueryClient } from '@tanstack/svelte-query'
import { onDestroy } from 'svelte'

/** Answers every `fetch` with `respond` until the calling component unmounts. */
export const stubFetch = (respond: (request: Request) => Promise<Response>) => {
  const original = globalThis.fetch
  globalThis.fetch = (input, init) => respond(new Request(input, init))
  onDestroy(() => {
    globalThis.fetch = original
  })
}

export const json = (body: unknown, status = 200) => Response.json(body, { status })

/** Calls `onInvalidate` whenever a mutation invalidates queries under `root`. */
export const trackInvalidations = (client: QueryClient, root: string, onInvalidate: () => void) => {
  const invalidate = client.invalidateQueries.bind(client)
  client.invalidateQueries = (filters, options) => {
    if (filters?.queryKey?.[0] === root) {
      onInvalidate()
    }
    return invalidate(filters, options)
  }
}
